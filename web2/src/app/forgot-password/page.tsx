"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="hidden w-full md:w-5/12 bg-blue-900 p-10 md:flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-24 -right-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
          
          <div className="relative z-10">
            <Link href="/" className="font-extrabold text-3xl tracking-tight text-white hover:text-orange-400 transition-colors inline-block mb-12">
              VISION ACADEMY
            </Link>
            <h2 className="text-4xl font-extrabold leading-tight mb-4">Forgot your password?</h2>
            <p className="text-blue-200 text-lg font-medium leading-relaxed">
              Don't worry, it happens to the best of us. Let's get you back into your account.
            </p>
          </div>
          
          <div className="relative z-10 mt-12 hidden md:block">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-blue-100">We'll send a secure reset link directly to your inbox.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Reset Password</h1>
            <p className="text-slate-500 font-medium text-base md:text-lg">Enter your email address to receive a recovery link.</p>
          </div>
          
          <form onSubmit={handleReset} className="space-y-5 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-slate-700 ml-1 text-sm md:text-base">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="!bg-white border-2 border-slate-200 h-12 md:h-14 text-base md:text-lg rounded-xl focus-visible:ring-0 focus-visible:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <p className="text-sm text-red-700 font-bold">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                <p className="text-sm text-green-700 font-bold">{message}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 mt-4 text-xl font-bold rounded-xl bg-blue-900 hover:bg-blue-950 text-white shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0" 
              disabled={loading}
            >
              {loading ? "Sending link..." : "Send Reset Link"}
            </Button>
            
            <p className="text-center text-slate-500 font-medium mt-8">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
