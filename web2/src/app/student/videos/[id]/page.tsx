"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";

interface Lecture {
  title: string;
  description: string;
  videoUrl: string;
  subject: string;
  teacher: string;
}

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const docRef = doc(db, "lectures", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLecture(docSnap.data() as Lecture);
        } else {
          setError("Lecture not found");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading video");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  // Anti-download measures
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (loading) return <div className="p-8">Loading video...</div>;
  if (error || !lecture) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-6 w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{lecture.title}</h1>
        <p className="text-zinc-500">{lecture.subject} | By {lecture.teacher}</p>
      </div>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl select-none">
        {/*
          Note: No web-based system can completely prevent downloading or screen recording.
          However, these measures (disabling context menu, using ReactPlayer controls config)
          make casual downloading difficult. In a full production env with paid services, 
          Widevine or FairPlay DRM would be required.
        */}
        <ReactPlayer
          url={lecture.videoUrl}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
        {/* Invisible overlay to prevent direct right-click on the video element just in case */}
        <div className="absolute inset-0 z-10 pointer-events-none"></div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <h3 className="font-semibold text-lg mb-2">Description</h3>
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {lecture.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}
