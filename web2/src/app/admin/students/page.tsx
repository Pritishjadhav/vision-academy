"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Student {
  id: string;
  email?: string;
  fullName?: string;
  batchId?: string;
  studentMobile?: string;
  parentMobile?: string;
}

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Students</h1>
        <p className="text-zinc-500">View and manage student profiles.</p>
      </div>

      <div className="flex items-center gap-4">
        <input 
          type="text" 
          placeholder="Search by name or mobile..."
          className="border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md px-4 py-2 w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : students.length === 0 ? (
            <p className="text-sm text-zinc-500">No students found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Student Mobile</th>
                    <th scope="col" className="px-6 py-3">Parent Mobile</th>
                    <th scope="col" className="px-6 py-3">Batch</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(s => 
                      (s.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (s.studentMobile || "").includes(searchTerm) ||
                      (s.parentMobile || "").includes(searchTerm)
                    )
                    .map(student => (
                    <tr key={student.id} className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-700">
                      <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap dark:text-white">
                        {student.fullName || "N/A"}
                      </td>
                      <td className="px-6 py-4">{student.studentMobile || "N/A"}</td>
                      <td className="px-6 py-4">{student.parentMobile || "N/A"}</td>
                      <td className="px-6 py-4">{student.batchId || "Unassigned"}</td>
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
