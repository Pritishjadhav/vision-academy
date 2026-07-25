"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Clock, Calendar } from "lucide-react";

interface Test {
  id: string;
  testName: string;
  subject: string;
  date: string;
  duration: number;
}

export default function StudentTestsPage() {
  const { user } = useAuthStore();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const q = query(collection(db, "tests"));
        const snapshot = await getDocs(q);
        setTests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Test[]);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests & Quizzes</h1>
        <p className="text-zinc-500">View upcoming tests and past results.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading tests...</p>
        ) : tests.length === 0 ? (
          <p className="text-zinc-500">No tests available.</p>
        ) : (
          tests.map(test => (
            <Card key={test.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col">
              <CardHeader className="pb-3 border-b dark:border-zinc-800">
                <CardTitle className="text-lg line-clamp-1">{test.testName}</CardTitle>
                <p className="text-sm text-zinc-500">{test.subject}</p>
              </CardHeader>
              <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> <span>{test.date || "Anytime"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> <span>{test.duration} Minutes</span>
                  </div>
                </div>
                <Link href={`/student/tests/${test.id}`} className="w-full">
                  <Button className="w-full">Start Test</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
