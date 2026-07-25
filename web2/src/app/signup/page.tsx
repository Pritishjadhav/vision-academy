"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString(),
      });
      
      // Create specific role document
      if (role === "student") {
        await setDoc(doc(db, "students", user.uid), {
          email: user.email,
          profileCompleted: false, // Flag to show onboarding
        });
      } else if (role === "parent") {
        await setDoc(doc(db, "parents", user.uid), {
          email: user.email,
          children: [],
        });
      }
      
      await signOut(auth); // Sign out immediately so they can log in
      setSuccessMsg("Account created successfully! You can now log in.");
      
      setTimeout(() => {
        router.push("/login");
      }, 2500);

    } catch (err: any) {
      let errorMessage = "Failed to create account. Please try again.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please log in.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address format.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. It must be at least 6 characters.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 bg-blue-50 relative overflow-hidden text-slate-900 font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-400/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>

      {/* Close Button */}
      <Link href="/" className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:scale-110 transition-all z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl z-10 flex flex-col md:flex-row-reverse bg-white rounded-3xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden"
      >
        {/* Right Side - Branding / Image (Hidden on mobile) */}
        <div className="hidden w-full md:w-5/12 bg-orange-500 p-10 md:flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-400 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-24 -left-24 w-64 h-64 bg-orange-300 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10">
            <Link href="/" className="font-extrabold text-3xl tracking-tight text-white hover:text-blue-100 transition-colors inline-block mb-12">
              VISION ACADEMY
            </Link>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">Start your journey with us.</h2>
            <p className="text-orange-100 text-lg font-medium leading-relaxed">
              Join thousands of students achieving their dreams with our world-class faculty and platform.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span className="font-bold text-orange-50">Interactive Lectures</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span className="font-bold text-orange-50">Doubt Solving</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-200" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span className="font-bold text-orange-50">Secure Mock Tests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Side - Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500 font-medium text-base md:text-lg">Sign up for a free account to get started.</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-5 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <Label className="font-bold text-slate-700 ml-1 text-sm md:text-base">I am a</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 font-bold h-12 md:h-14 text-base md:text-lg rounded-xl transition-all border-2 ${role === "student" ? "!bg-blue-50 !border-blue-600 text-blue-700 shadow-sm" : "!bg-white !border-slate-200 text-slate-500 hover:!border-slate-300 hover:!bg-slate-50"}`}
                  onClick={() => setRole("student")}
                >
                  <svg className={`w-5 h-5 ${role === "student" ? "text-blue-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                  Student
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 font-bold h-12 md:h-14 text-base md:text-lg rounded-xl transition-all border-2 ${role === "parent" ? "!bg-orange-50 !border-orange-500 text-orange-700 shadow-sm" : "!bg-white !border-slate-200 text-slate-500 hover:!border-slate-300 hover:!bg-slate-50"}`}
                  onClick={() => setRole("parent")}
                >
                  <svg className={`w-5 h-5 ${role === "parent" ? "text-orange-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Parent
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-slate-700 ml-1 text-sm md:text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-slate-700 ml-1 text-sm md:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-bold text-slate-700 ml-1 text-sm md:text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <p className="text-sm text-green-700 font-bold">{successMsg}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 mt-4 text-xl font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            
            <p className="text-center text-slate-500 font-medium mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
