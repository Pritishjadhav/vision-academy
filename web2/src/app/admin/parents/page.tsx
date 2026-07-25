"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Parent {
  id: string;
  parentMobile?: string;
  linkedStudentId?: string;
}

export default function ManageParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchParents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "parents"));
      const parentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Parent[];
      setParents(parentsData);
    } catch (error) {
      console.error("Error fetching parents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Parents</h1>
        <p className="text-zinc-500">View and manage parent profiles.</p>
      </div>

      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Search by parent mobile..."
          className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md px-4 py-2 w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parents List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : parents.length === 0 ? (
            <p className="text-sm text-zinc-500">No parents found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Parent ID (Auth UID)</th>
                    <th scope="col" className="px-6 py-3">Parent Mobile</th>
                    <th scope="col" className="px-6 py-3">Linked Student ID</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parents
                    .filter(p => (p.parentMobile || "").includes(searchTerm))
                    .map(parent => (
                    <tr key={parent.id} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-700">
                      <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap dark:text-white">
                        {parent.id}
                      </td>
                      <td className="px-6 py-4">{parent.parentMobile || "N/A"}</td>
                      <td className="px-6 py-4 font-mono text-xs">{parent.linkedStudentId || "None"}</td>
                      <td className="px-6 py-4">
                        <Button variant="outline" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
