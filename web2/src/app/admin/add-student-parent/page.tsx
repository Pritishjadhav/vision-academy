"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { db, firebaseConfig } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export default function AddStudentParentPage() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [studentMobile, setStudentMobile] = useState("");
  const [parentMobile, setParentMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (studentMobile.length < 10 || parentMobile.length < 10) {
      setError("Please enter valid mobile numbers.");
      setLoading(false);
      return;
    }

    try {
      // 1. Initialize secondary Firebase app for creating accounts without logging admin out
      let secondaryApp;
      try {
        secondaryApp = getApp("Secondary");
      } catch (err) {
        secondaryApp = initializeApp(firebaseConfig, "Secondary");
      }
      const secondaryAuth = getAuth(secondaryApp);

      const studentEmail = `${studentMobile}@student.visionacademy.local`;
      const parentEmail = `${parentMobile}@parent.visionacademy.local`;
      
      // Default passwords are the mobile numbers
      const studentPassword = studentMobile;
      const parentPassword = parentMobile;

      // 2. Create Student Auth Account
      let studentUid = "";
      try {
        const studentCred = await createUserWithEmailAndPassword(secondaryAuth, studentEmail, studentPassword);
        studentUid = studentCred.user.uid;
        await signOut(secondaryAuth);
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          throw new Error("A student with this mobile number already exists.");
        }
        throw err;
      }

      // 3. Create Parent Auth Account
      let parentUid = "";
      try {
        const parentCred = await createUserWithEmailAndPassword(secondaryAuth, parentEmail, parentPassword);
        parentUid = parentCred.user.uid;
        await signOut(secondaryAuth);
      } catch (err: any) {
        if (err.code === "auth/email-already-in-use") {
          // Parent already exists, let's try to get their existing UID by signing in
          // This is a workaround since we can't fetch UIDs by email without Admin SDK easily
          try {
             const existingParentCred = await createUserWithEmailAndPassword(secondaryAuth, parentEmail, parentPassword);
             parentUid = existingParentCred.user.uid; // Unreachable, just in case
          } catch (loginErr: any) {
             throw new Error("Parent mobile number is already registered to another account. Please use a unique parent mobile.");
          }
        } else {
          throw err;
        }
      }

      // 4. Create Firestore Documents using primary db (Admin is logged in)
      const fullName = `${lastName} ${firstName} ${middleName}`.trim();

      // Student Docs
      await setDoc(doc(db, "users", studentUid), {
        userId: studentUid,
        email: studentEmail,
        mobile: studentMobile,
        role: "student",
        createdAt: new Date().toISOString()
      });

      await setDoc(doc(db, "students", studentUid), {
        studentId: studentUid,
        fullName,
        lastName,
        firstName,
        middleName,
        studentMobile,
        parentMobile,
        parentId: parentUid,
        createdAt: new Date().toISOString()
      });

      // Parent Docs
      // Use merge:true in case the parent document already exists
      await setDoc(doc(db, "users", parentUid), {
        userId: parentUid,
        email: parentEmail,
        mobile: parentMobile,
        role: "parent",
        createdAt: new Date().toISOString()
      }, { merge: true });

      const parentDocRef = doc(db, "parents", parentUid);
      const parentDocSnap = await getDoc(parentDocRef);
      
      let children = [studentUid];
      if (parentDocSnap.exists()) {
        const data = parentDocSnap.data();
        if (data.children) {
          children = [...new Set([...data.children, studentUid])];
        }
      }

      await setDoc(parentDocRef, {
        parentId: parentUid,
        parentMobile,
        linkedStudentId: studentUid, // Primary linked student
        children: children, // Array of linked students for rules
        createdAt: new Date().toISOString()
      }, { merge: true });

      setSuccess(true);
      // Reset form
      setLastName("");
      setFirstName("");
      setMiddleName("");
      setStudentMobile("");
      setParentMobile("");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating accounts.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Student & Parent</h1>
        <p className="text-zinc-500">Create a new student account securely linked to a parent account.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            The mobile numbers will be used as the Login Username and default Password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md font-medium">
              Student and Parent accounts created successfully.
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input id="middleName" value={middleName} onChange={e => setMiddleName(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentMobile">Student Mobile Number</Label>
                <Input 
                  id="studentMobile" 
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={studentMobile} 
                  onChange={e => setStudentMobile(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-semibold text-lg border-b pb-2">Parent Information</h3>
              <div className="space-y-2">
                <Label htmlFor="parentMobile">Parent Mobile Number</Label>
                <Input 
                  id="parentMobile" 
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={parentMobile} 
                  onChange={e => setParentMobile(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12" disabled={loading}>
              {loading ? "Creating Accounts..." : "Create Student & Parent Accounts"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
