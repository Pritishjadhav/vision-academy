"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState<"student" | "parent" | "admin">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { role, loading: authLoading, user } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let finalEmail = identifier.trim();
    
    // Auto-format mobile numbers to proxy emails for student/parent
    if (!finalEmail.includes("@")) {
      if (loginRole === "student") {
        finalEmail = `${finalEmail}@student.visionacademy.local`;
      } else if (loginRole === "parent") {
        finalEmail = `${finalEmail}@parent.visionacademy.local`;
      }
    }

    try {
      await signInWithEmailAndPassword(auth, finalEmail, password);
      // Let the AuthProvider fetch the role and set it
      // The redirect should ideally happen based on the role, 
      // which we can handle in a useEffect once role is populated.
    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only act once the global auth state has finished loading
    if (authLoading) return;

    if (role) {
      // Role fetched successfully — redirect to the correct dashboard
      if (role === "student") router.push("/student");
      else if (role === "admin" || role === "super_admin") router.push("/admin");
      else if (role === "parent") router.push("/parent");
    } else if (user && !role) {
      // User is authenticated but has no role document in Firestore
      // This can happen due to a Firestore permission error or missing document
      setLoading(false);
      setError("Account setup is incomplete. Please contact support or try signing up again.");
    }
  }, [role, authLoading, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-8 bg-blue-50 relative overflow-hidden text-slate-900 font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-400/30 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>

      {/* Close Button */}
      <Link href="/" className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-500 hover:text-orange-600 hover:scale-110 transition-all z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl z-10 flex flex-col md:flex-row bg-white rounded-3xl md:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden"
      >
        {/* Left Side - Branding / Image (Hidden on mobile) */}
        <div className="hidden w-full md:w-5/12 bg-blue-600 p-10 md:flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10">
            <Link href="/" className="font-extrabold text-3xl tracking-tight text-white hover:text-orange-300 transition-colors inline-block mb-12">
              VISION ACADEMY
            </Link>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">Welcome back to your classroom.</h2>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">
              Log in to access your dashboard, view upcoming lectures, and track your performance.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                 <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-blue-600" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=2" className="w-10 h-10 rounded-full border-2 border-blue-600" alt="Student" />
                 <img src="https://i.pravatar.cc/100?img=3" className="w-10 h-10 rounded-full border-2 border-blue-600" alt="Student" />
              </div>
              <p className="text-sm font-bold text-blue-100">Join 10,000+ students</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Log In</h1>
            <p className="text-slate-500 font-medium text-base md:text-lg">Enter your details to access your account.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            
            <div className="space-y-2 md:space-y-3">
              <Label className="font-bold text-slate-700 ml-1 text-sm md:text-base">Login As</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 font-bold h-10 md:h-12 text-sm md:text-base rounded-xl transition-all border-2 ${loginRole === "student" ? "!bg-blue-50 !border-blue-600 text-blue-700 shadow-sm" : "!bg-white !border-slate-200 text-slate-500 hover:!border-slate-300 hover:!bg-slate-50"}`}
                  onClick={() => setLoginRole("student")}
                >
                  Student
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 font-bold h-10 md:h-12 text-sm md:text-base rounded-xl transition-all border-2 ${loginRole === "parent" ? "!bg-orange-50 !border-orange-500 text-orange-700 shadow-sm" : "!bg-white !border-slate-200 text-slate-500 hover:!border-slate-300 hover:!bg-slate-50"}`}
                  onClick={() => setLoginRole("parent")}
                >
                  Parent
                </button>
                <button
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 font-bold h-10 md:h-12 text-sm md:text-base rounded-xl transition-all border-2 ${loginRole === "admin" ? "!bg-zinc-100 !border-zinc-800 text-zinc-900 shadow-sm" : "!bg-white !border-slate-200 text-slate-500 hover:!border-slate-300 hover:!bg-slate-50"}`}
                  onClick={() => setLoginRole("admin")}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier" className="font-bold text-slate-700 ml-1 text-sm md:text-base">
                {loginRole === "admin" ? "Email Address" : "Mobile Number (or Email)"}
              </Label>
              <Input
                id="identifier"
                type={loginRole === "admin" ? "email" : "text"}
                placeholder={loginRole === "admin" ? "admin@example.com" : "e.g. 9876543210"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="font-bold text-slate-700 text-sm md:text-base">Password</Label>
                <Link href="/forgot-password" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 mt-4 text-xl font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0" 
              disabled={loading || authLoading}
            >
              {loading ? "Logging in..." : authLoading && user ? "Verifying account..." : "Log In"}
            </Button>
            
            <p className="text-center text-slate-500 font-medium mt-8">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
