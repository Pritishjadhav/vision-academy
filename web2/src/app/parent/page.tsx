"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, BookOpen, User, Award, Activity, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { db } from "@/lib/firebase";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";

export default function ParentDashboardPage() {
  const { user } = useAuthStore();
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Real-time data states
  const [rawResults, setRawResults] = useState<any[]>([]);
  const [videoProgress, setVideoProgress] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [testsMap, setTestsMap] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;
    
    let unsubParent: any;
    let unsubStudent: any;
    let unsubResults: any;
    let unsubVideos: any;
    let unsubAttendance: any;
    let unsubTests: any;

    unsubParent = onSnapshot(doc(db, "parents", user.uid), (parentDoc) => {
      if (!parentDoc.exists()) {
        setLoading(false);
        return;
      }
      
      const linkedStudentId = parentDoc.data().linkedStudentId;
      if (!linkedStudentId) {
        setLoading(false);
        return;
      }

      // 1. Fetch Student Info
      unsubStudent = onSnapshot(doc(db, "students", linkedStudentId), (studentDoc) => {
        if (studentDoc.exists()) {
          setStudentInfo(studentDoc.data());
        }
      });

      // 2. Fetch Results
      const resultsQuery = query(collection(db, "results"), where("studentId", "==", linkedStudentId));
      unsubResults = onSnapshot(resultsQuery, (snap) => {
        setRawResults(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      // 3. Fetch Video Progress
      const videoQuery = query(collection(db, "videoProgress"), where("studentId", "==", linkedStudentId));
      unsubVideos = onSnapshot(videoQuery, (snap) => {
        setVideoProgress(snap.docs.map(d => d.data()));
      });

      // 4. Fetch Attendance
      const attendanceQuery = query(collection(db, "attendance"), where("studentId", "==", linkedStudentId));
      unsubAttendance = onSnapshot(attendanceQuery, (snap) => {
        setAttendance(snap.docs.map(d => d.data()));
      });
      
      setLoading(false);
    });

    // 5. Fetch Tests Map (for names, subjects, max scores)
    unsubTests = onSnapshot(collection(db, "tests"), (snap) => {
      const map: Record<string, any> = {};
      snap.docs.forEach(d => { map[d.id] = d.data(); });
      setTestsMap(map);
    });

    return () => {
      if (unsubParent) unsubParent();
      if (unsubStudent) unsubStudent();
      if (unsubResults) unsubResults();
      if (unsubVideos) unsubVideos();
      if (unsubAttendance) unsubAttendance();
      if (unsubTests) unsubTests();
    };
  }, [user]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  // Data Aggregation & Calculations
  const hasActivity = rawResults.length > 0 || videoProgress.length > 0 || attendance.length > 0;
  
  // Tests & Results calculations
  const totalTests = rawResults.length;
  let highestScore = 0;
  let lowestScore = 100;
  let totalScoreSum = 0;
  
  const subjectStats: Record<string, { score: number, count: number }> = {};
  
  const processedResults = rawResults.map(r => {
    const test = testsMap[r.testId] || {};
    const posMarks = test.positiveMarks || 4;
    const totalQ = (r.correct || 0) + (r.wrong || 0) + (r.skipped || 0);
    // If we can't determine max score, fallback to assuming totalQ > 0 or 100
    const maxScore = totalQ > 0 ? totalQ * posMarks : 100;
    
    let percentage = 0;
    if (maxScore > 0) {
       percentage = (r.score / maxScore) * 100;
    }
    // ensure percentage isn't negative
    percentage = Math.max(0, percentage);

    const subject = test.subject || "General";
    if (!subjectStats[subject]) {
      subjectStats[subject] = { score: 0, count: 0 };
    }
    subjectStats[subject].score += percentage;
    subjectStats[subject].count += 1;

    highestScore = Math.max(highestScore, percentage);
    lowestScore = Math.min(lowestScore, percentage);
    totalScoreSum += percentage;

    const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A";
    const time = r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "";

    return {
      ...r,
      name: test.title || `Test ${r.testId?.slice(0, 4) || ''}`,
      subject,
      percentage: parseFloat(percentage.toFixed(1)),
      maxScore,
      date,
      time
    };
  }).sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()); // sort chronologically

  if (lowestScore === 100 && totalTests === 0) lowestScore = 0;
  const averageScore = totalTests > 0 ? (totalScoreSum / totalTests) : 0;
  const passStatus = averageScore >= 40 ? "Pass" : "Fail";
  
  const latestResult = processedResults.length > 0 ? processedResults[processedResults.length - 1] : null;

  // Subject Analysis
  let strongestSubject = { name: "N/A", avg: 0 };
  let weakestSubject = { name: "N/A", avg: 100 };
  
  Object.keys(subjectStats).forEach(sub => {
    const avg = subjectStats[sub].score / subjectStats[sub].count;
    if (avg >= strongestSubject.avg) strongestSubject = { name: sub, avg };
    if (avg <= weakestSubject.avg) weakestSubject = { name: sub, avg };
  });

  if (totalTests === 0) {
    weakestSubject.avg = 0;
  }

  // Lectures & Attendance
  const lecturesWatched = videoProgress.length;
  // Assume attendance is just a count of records out of total days or stored explicitly.
  // Since we don't have schema, we just show N/A or count for now.
  const attendancePercentage = attendance.length > 0 ? "Data exists" : "N/A";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parent Overview</h1>
        <p className="text-zinc-500">Monitor your child's academic progress in real-time.</p>
      </div>

      {/* Linked Student Profile Card */}
      {studentInfo ? (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Student Profile (Read-Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <p className="text-sm text-zinc-500">Full Name</p>
                <p className="font-semibold">{studentInfo.fullName || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Age / Gender</p>
                <p className="font-semibold">{studentInfo.age || "-"} / {studentInfo.gender || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Student Mobile</p>
                <p className="font-semibold">{studentInfo.studentMobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-500">Date of Birth</p>
                <p className="font-semibold">{studentInfo.dob || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardContent className="p-6">
            <p className="text-zinc-500">No linked student profile found. Please link a student using your mobile number.</p>
          </CardContent>
        </Card>
      )}

      {!hasActivity && studentInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          No student activity available yet. The overview will appear after the student attempts a test or receives results.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            {totalTests > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <Activity className="h-4 w-4 text-zinc-500" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests > 0 ? `${averageScore.toFixed(1)}%` : "No data available"}</div>
            <p className="text-xs text-zinc-500">{totalTests > 0 ? `Overall Pass Status: ${passStatus}` : "No data available"}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tests Attempted</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-zinc-500">
              {totalTests > 0 ? `Highest: ${highestScore.toFixed(1)}% | Lowest: ${lowestScore.toFixed(1)}%` : "0 tests completed"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lecture Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lecturesWatched}</div>
            <p className="text-xs text-zinc-500">Lectures watched</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Test Result</CardTitle>
            <Calendar className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestResult ? `${latestResult.percentage}%` : "No test attempted yet"}</div>
            <p className="text-xs text-zinc-500 truncate">
              {latestResult ? `${latestResult.name} (${latestResult.date} ${latestResult.time})` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {totalTests > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedResults}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888" strokeOpacity={0.2} />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`${value}%`, 'Score']}
                    labelFormatter={(label, payload) => {
                       if (payload && payload.length > 0) {
                         const p = payload[0].payload;
                         return `${label} (${p.date} ${p.time})`;
                       }
                       return label;
                    }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-zinc-500">No performance data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900">
          <CardHeader>
            <CardTitle>Subject Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {totalTests > 0 ? (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Strongest Subject</span>
                    <span className="text-sm font-medium">{strongestSubject.name} ({strongestSubject.avg.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-800">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, strongestSubject.avg)}%` }}></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t dark:border-zinc-800">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">Weakest Subject</span>
                    <span className="text-sm font-medium">{weakestSubject.name} ({weakestSubject.avg.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 rounded-full h-2 dark:bg-zinc-800">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, weakestSubject.avg)}%` }}></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-32 flex items-center justify-center">
                 <p className="text-zinc-500">Take tests to see subject analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
