"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

interface Lecture {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  teacher: string;
  createdAt: string;
}

export default function MyLecturesPage() {
  const { user } = useAuthStore();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      if (!user) return;
      try {
        // Ideally, we fetch the student's batchId first and then query lectures for that batch.
        // For demonstration, we'll fetch all lectures or mock a query.
        const q = query(collection(db, "lectures"));
        const snapshot = await getDocs(q);
        setLectures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lecture[]);
      } catch (error) {
        console.error("Error fetching lectures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Lectures</h1>
        <p className="text-zinc-500">Access your batch's video lectures.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading lectures...</p>
        ) : lectures.length === 0 ? (
          <p className="text-zinc-500">No lectures available for your batch yet.</p>
        ) : (
          lectures.map(lecture => (
            <Link key={lecture.id} href={`/student/videos/${lecture.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <CardHeader className="pb-3 border-b dark:border-zinc-800">
                  <div className="aspect-video bg-zinc-200 dark:bg-zinc-800 rounded-md flex items-center justify-center relative overflow-hidden group">
                    <PlayCircle className="w-12 h-12 text-zinc-400 group-hover:text-primary transition-colors z-10" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                  <CardTitle className="text-lg line-clamp-1">{lecture.title}</CardTitle>
                  <div className="text-sm text-zinc-500 flex justify-between">
                    <span>{lecture.subject}</span>
                    <span>{lecture.chapter}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">By: {lecture.teacher}</p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
