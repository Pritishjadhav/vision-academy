"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: string; // Global, Student, Parent, or Batch ID
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("Global");
  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch batches for target options
      const batchSnapshot = await getDocs(collection(db, "batches"));
      setBatches(batchSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));

      // Fetch announcements
      const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
      const annSnapshot = await getDocs(q);
      setAnnouncements(annSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "announcements"), {
        title,
        content,
        target,
        createdAt: new Date().toISOString()
      });
      setTitle("");
      setContent("");
      setTarget("Global");
      fetchData();
    } catch (error) {
      console.error("Error posting announcement:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      fetchData();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-zinc-500">Post announcements to students, parents, or specific batches.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePost} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                >
                  <option value="Global">All (Global)</option>
                  <option value="Student">All Students</option>
                  <option value="Parent">All Parents</option>
                  <optgroup label="Specific Batches">
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Posting..." : "Post Announcement"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-zinc-500">No announcements posted yet.</p>
            ) : (
              <ul className="space-y-4">
                {announcements.map(ann => (
                  <li key={ann.id} className="p-4 border rounded-md relative bg-zinc-50 dark:bg-zinc-800/50">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                      onClick={() => handleDelete(ann.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold pr-8">{ann.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">Target: {ann.target}</span>
                      <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{ann.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
