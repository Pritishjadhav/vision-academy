"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Question {
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
}

export default function TestCreationPage() {
  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  
  // Test Details
  const [testName, setTestName] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [positiveMarks, setPositiveMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      const snapshot = await getDocs(collection(db, "batches"));
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    };
    fetchBatches();
  }, []);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" }
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    (newQuestions[index] as any)[field] = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSaveTest = async () => {
    if (!testName || !batchId || questions.length === 0) {
      alert("Please fill all required fields and add at least one question.");
      return;
    }

    setSaving(true);
    try {
      const testRef = await addDoc(collection(db, "tests"), {
        testName,
        subject,
        chapter,
        batchId,
        date,
        startTime,
        endTime,
        duration: parseInt(duration),
        positiveMarks,
        negativeMarks,
        createdAt: new Date().toISOString()
      });

      // Save questions in subcollection
      for (const [index, q] of questions.entries()) {
        await addDoc(collection(db, `tests/${testRef.id}/questions`), {
          ...q,
          order: index
        });
      }

      alert("Test created successfully!");
      // Reset form
      setTestName("");
      setQuestions([]);
    } catch (error) {
      console.error("Error saving test:", error);
      alert("Failed to create test.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create MCQ Test</h1>
        <p className="text-zinc-500">Design a new test with anti-cheating features enabled by default.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Test Name</Label>
              <Input value={testName} onChange={e => setTestName(e.target.value)} placeholder="e.g., Weekly Mock Test 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Chapter</Label>
                <Input value={chapter} onChange={e => setChapter(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Batch</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                >
                  <option value="">Select...</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Duration (mins)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Positive Marks</Label>
                <Input type="number" value={positiveMarks} onChange={e => setPositiveMarks(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Negative Marks</Label>
                <Input type="number" value={negativeMarks} onChange={e => setNegativeMarks(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button onClick={addQuestion} size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" /> Add Question</Button>
          </CardHeader>
          <CardContent className="space-y-6 max-h-[600px] overflow-auto">
            {questions.length === 0 ? (
              <div className="text-center text-zinc-500 py-8">No questions added yet.</div>
            ) : (
              questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border rounded-md relative bg-zinc-50 dark:bg-zinc-800/50 space-y-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => removeQuestion(qIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="space-y-2 pr-8">
                    <Label>Question {qIndex + 1}</Label>
                    <textarea 
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={q.questionText}
                      onChange={e => updateQuestion(qIndex, "questionText", e.target.value)}
                      placeholder="Enter question text..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`} 
                          checked={q.correctOptionIndex === oIndex}
                          onChange={() => updateQuestion(qIndex, "correctOptionIndex", oIndex)}
                          className="w-4 h-4 text-primary"
                        />
                        <Input 
                          placeholder={`Option ${oIndex + 1}`} 
                          value={opt}
                          onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                          className={q.correctOptionIndex === oIndex ? "border-green-500 ring-1 ring-green-500" : ""}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Explanation (Optional)</Label>
                    <textarea 
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={q.explanation}
                      onChange={e => updateQuestion(qIndex, "explanation", e.target.value)}
                      placeholder="Explain the correct answer..."
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
          {questions.length > 0 && (
            <CardFooter className="border-t pt-4">
              <Button onClick={handleSaveTest} className="w-full" disabled={saving}>
                {saving ? "Saving Test..." : "Save Complete Test"}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
