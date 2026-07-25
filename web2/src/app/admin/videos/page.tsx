"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoUploadPage() {
  const [batches, setBatches] = useState<{id: string, name: string}[]>([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [batchId, setBatchId] = useState("");
  const [teacher, setTeacher] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBatches = async () => {
      const snapshot = await getDocs(collection(db, "batches"));
      setBatches(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name })));
    };
    fetchBatches();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !batchId) return;

    setUploading(true);
    const storageRef = ref(storage, `videos/${batchId}/${Date.now()}_${videoFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, "lectures"), {
          title,
          subject,
          chapter,
          batchId,
          teacher,
          description,
          videoUrl: downloadURL,
          storagePath: uploadTask.snapshot.ref.fullPath,
          createdAt: new Date().toISOString()
        });
        setUploading(false);
        setProgress(0);
        setTitle("");
        setSubject("");
        setChapter("");
        setTeacher("");
        setDescription("");
        setVideoFile(null);
        alert("Video uploaded successfully!");
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Lecture Video</h1>
        <p className="text-zinc-500">Add new lecture videos for a specific batch.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lecture Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Chapter</Label>
                <Input value={chapter} onChange={e => setChapter(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Teacher</Label>
                <Input value={teacher} onChange={e => setTeacher(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Batch</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                  required
                >
                  <option value="">Select a batch...</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Video File</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={e => setVideoFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            {uploading && (
              <div className="w-full bg-zinc-200 rounded-full h-2.5 dark:bg-zinc-700">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            )}

            <Button type="submit" disabled={uploading || !videoFile}>
              {uploading ? `Uploading... ${Math.round(progress)}%` : "Upload Video"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
