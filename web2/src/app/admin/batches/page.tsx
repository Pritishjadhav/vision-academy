"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Batch {
  id: string;
  name: string;
  type: string;
}

export default function ManageBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchType, setNewBatchType] = useState("Integrated");
  const [loading, setLoading] = useState(true);

  const fetchBatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "batches"));
      const batchesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Batch[];
      setBatches(batchesData);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName) return;
    try {
      await addDoc(collection(db, "batches"), {
        name: newBatchName,
        type: newBatchType,
        createdAt: new Date().toISOString()
      });
      setNewBatchName("");
      fetchBatches();
    } catch (error) {
      console.error("Error adding batch:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "batches", id));
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Batches</h1>
        <p className="text-zinc-500">Create and manage academy batches.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="batchName">Batch Name</Label>
                <Input
                  id="batchName"
                  placeholder="e.g., 11th JEE"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchType">Batch Type</Label>
                <select
                  id="batchType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newBatchType}
                  onChange={(e) => setNewBatchType(e.target.value)}
                >
                  <option value="Integrated">Integrated</option>
                  <option value="Regular">Regular</option>
                </select>
              </div>
              <Button type="submit">Add Batch</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Batches</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : batches.length === 0 ? (
              <p className="text-sm text-zinc-500">No batches found.</p>
            ) : (
              <ul className="space-y-2">
                {batches.map(batch => (
                  <li key={batch.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{batch.name}</p>
                      <p className="text-xs text-zinc-500">{batch.type}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(batch.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
