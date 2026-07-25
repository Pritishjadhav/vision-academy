"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock } from "lucide-react";

export default function TestAttemptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [violationMsg, setViolationMsg] = useState("");

  const submitTest = useCallback(async (forcedMsg = "") => {
    if (submitted) return;
    setSubmitted(true);
    if (forcedMsg) setViolationMsg(forcedMsg);

    try {
      // Calculate score
      let score = 0;
      let correct = 0;
      let wrong = 0;
      
      questions.forEach((q, index) => {
        const ans = answers[index];
        if (ans !== undefined) {
          if (ans === q.correctOptionIndex) {
            score += (test.positiveMarks || 4);
            correct++;
          } else {
            score -= (test.negativeMarks || 1);
            wrong++;
          }
        }
      });

      await addDoc(collection(db, "results"), {
        testId: id,
        studentId: user?.uid,
        score,
        correct,
        wrong,
        skipped: questions.length - correct - wrong,
        answers,
        violation: forcedMsg,
        createdAt: new Date().toISOString()
      });

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    } catch (err) {
      console.error("Error submitting test", err);
    }
  }, [answers, id, questions, submitted, test, user]);

  useEffect(() => {
    const fetchTest = async () => {
      const testDoc = await getDoc(doc(db, "tests", id as string));
      if (testDoc.exists()) {
        const testData = testDoc.data();
        setTest(testData);
        setTimeRemaining(testData.duration * 60);

        const qSnapshot = await getDocs(collection(db, `tests/${id}/questions`));
        setQuestions(qSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      setLoading(false);
    };
    fetchTest();
  }, [id]);

  // Timer
  useEffect(() => {
    let timer: any;
    if (isTestStarted && !submitted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTestStarted && !submitted) {
      submitTest("Time's up");
    }
    return () => clearInterval(timer);
  }, [isTestStarted, submitted, timeRemaining, submitTest]);

  // Anti-cheating
  useEffect(() => {
    if (!isTestStarted || submitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) submitTest("Your test has been automatically submitted because you left the test window.");
    };
    const handleBlur = () => {
      submitTest("Your test has been automatically submitted because you left the test window.");
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) submitTest("Your test has been automatically submitted because you exited fullscreen.");
    };
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isTestStarted, submitted, submitTest]);

  const startTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsTestStarted(true);
    } catch (err) {
      alert("You must allow fullscreen to start the test.");
    }
  };

  if (loading) return <div className="p-8">Loading test...</div>;
  if (!test) return <div className="p-8">Test not found.</div>;

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md text-center p-6">
          <CardTitle className="mb-4 text-2xl font-bold">Test Submitted</CardTitle>
          {violationMsg && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3 text-left text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{violationMsg}</p>
            </div>
          )}
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">Your answers have been recorded.</p>
          <Button onClick={() => router.push("/student/results")}>View Results</Button>
        </Card>
      </div>
    );
  }

  if (!isTestStarted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-lg p-6">
          <CardTitle className="mb-4 text-2xl font-bold">{test.testName}</CardTitle>
          <div className="space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
            <p><strong>Duration:</strong> {test.duration} mins</p>
            <p><strong>Questions:</strong> {questions.length}</p>
            <p><strong>Rules:</strong></p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Do not exit fullscreen mode.</li>
              <li>Do not switch tabs or windows.</li>
              <li>Right-click and copy/paste are disabled.</li>
              <li>Violation of rules will result in automatic submission.</li>
            </ul>
          </div>
          <Button onClick={startTest} className="w-full">Agree & Start Test</Button>
        </Card>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const q = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 select-none">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="font-bold">{test.testName}</div>
        <div className="flex items-center gap-2 font-mono text-lg font-medium text-red-500">
          <Clock className="w-5 h-5" />
          {formatTime(timeRemaining)}
        </div>
        <Button variant="destructive" onClick={() => submitTest()}>Submit Test</Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-6">
                <span className="text-zinc-500 mr-2">Q{currentQuestion + 1}.</span> 
                {q?.questionText}
              </h2>
              <div className="space-y-3">
                {q?.options.map((opt: string, i: number) => (
                  <label 
                    key={i} 
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion] === i 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="option" 
                      className="w-4 h-4 text-primary mr-3"
                      checked={answers[currentQuestion] === i}
                      onChange={() => setAnswers({ ...answers, [currentQuestion]: i })}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Question Palette */}
        <div className="w-full md:w-64">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-sm">Question Palette</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuestion(i)}
                    className={`w-8 h-8 rounded-md text-xs font-medium flex items-center justify-center transition-colors ${
                      currentQuestion === i
                        ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-zinc-900'
                        : ''
                    } ${
                      answers[i] !== undefined
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
