"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/PublicNavbar";
import { BookOpen, Trophy, ShieldCheck, Clock, CheckCircle2, Target, Lightbulb, Heart, Phone, Mail, Send, Award, Star, User, MapPin, MonitorPlay, MessageCircleQuestion, ClipboardList, Compass, History, TrendingUp, RefreshCw, Layers, Edit3, Mic, Video, FileText, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { MEDIA } from "@/lib/assets";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
type FormValues = z.infer<typeof formSchema>;

const renderAchieverCard = (student: any, tag: string, tagClass: string, keyPrefix: string) => (
  <Card key={keyPrefix} className="w-[280px] h-full shrink-0 border-none shadow-md bg-blue-50 hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col">
    <CardContent className="pt-6 px-4 pb-6 flex flex-col items-center text-center flex-1 justify-between">
      <div className="flex flex-col items-center w-full">
        <div className="w-32 h-32 rounded-full border-[5px] border-white shadow-md bg-blue-100 flex items-center justify-center text-blue-400 mb-4 relative overflow-hidden shrink-0">
          {student.image ? (
            <Image src={student.image} alt={student.name} fill className="object-cover" />
          ) : (
            <User className="w-14 h-14 opacity-50" />
          )}
        </div>
        <h3 className="text-lg md:text-xl font-extrabold text-blue-900 w-full mb-2 break-words leading-tight" title={student.name}>{student.name}</h3>
        <p className="text-orange-600 font-bold text-sm md:text-base leading-snug w-full break-words px-2" title={student.college}>{student.college}</p>
      </div>
      <div className="mt-5 shrink-0">
        <span className={`text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full ${tagClass}`}>{tag}</span>
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(formSchema) });
  const { user, role, loading: authLoading } = useAuthStore();

  const onSubmit = (data: FormValues) => {
    const subject = encodeURIComponent("Vision Academy Enquiry");
    const body = encodeURIComponent(`Name: ${data.fullName}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
    window.location.href = `mailto:pritishjadhav2006@gmail.com?subject=${subject}&body=${body}`;
  };

  const contacts = [
    { name: "Mayur Sir", phone: "+91 7755999944" },
  ];

  const results = [
    { name: "Rahul Sharma", achievement: "NEET Topper 2025", score: "705 / 720", image: MEDIA.results.rahulSharma, quote: "Vision Academy's continuous testing helped me identify my weak spots." },
    { name: "Priya Patel", achievement: "JEE Advanced AIR 452", score: "99.8 PR", image: MEDIA.results.priyaPatel, quote: "The faculty teaches you how to think critically and approach complex problems." },
    { name: "Aditya Verma", achievement: "State Board Topper", score: "97.4%", image: MEDIA.results.adityaVerma, quote: "Thanks to the Regular Batch, I was able to secure a top rank." }
  ];

  const engineeringAchievers = [
    { name: "Pawar Pratiksha", college: "NIT Nagpur (CS)" },
    { name: "Barne Vibhavari", college: "PICT" },
    { name: "Lunawat Akash", college: "PICT" },
    { name: "Sawale Krishna", college: "PICT" },
    { name: "Khaladkar Sanskar", college: "PICT" },
    { name: "Jadhav Pritish", college: "VIT", image: "/images/jadhav pritish.jpg.jpeg" },
    { name: "Rale Aryan", college: "VIT" },
    { name: "Lende Vedant", college: "VIT" },
    { name: "Jondhale Jayesen", college: "VIT" },
    { name: "Kohinkar Apurva", college: "VIT" },
    { name: "Thite Anushka", college: "Cummins" },
    { name: "Argade Shruti", college: "Cummins" },
    { name: "Salunke Bhakti", college: "Cummins" },
    { name: "Dalvi Vaishnavi", college: "PCCOE" },
    { name: "Khaire Sanket", college: "PCCOE" },
    { name: "Pangavhane Purva", college: "PCCOE" }
  ];

  const medicalAchievers = [
    { name: "Gorde Pritam", college: "Govt. MBBS" },
    { name: "Pacharne Shantanu", college: "MBBS" },
    { name: "Tagad Hitesh", college: "MBBS" },
    { name: "Sandbhor Omkar", college: "MBBS" },
    { name: "Bindle Pratiksha", college: "BDS" },
    { name: "Bankar Vaishnavi", college: "BDS" },
    { name: "Yelbhar Bhakti", college: "BAMS" },
    { name: "Totre Kartik", college: "BAMS" },
    { name: "Medge Aryan", college: "Semi Govt. MBBS" },
    { name: "Dherange Shubham", college: "BAMS" },
    { name: "Jaid Shruti", college: "BHMS" },
    { name: "Dhangar Lalit", college: "BHMS" },
    { name: "Bhandari Roshani", college: "BHMS" },
    { name: "Bhogade Shraddha", college: "BHMS" },
    { name: "Sutar Pranjali", college: "BHMS" },
    { name: "Chavan Rachna", college: "Physiotherapy (LTCOP)" }
  ];

  const engRow1 = engineeringAchievers.slice(0, Math.ceil(engineeringAchievers.length / 2));
  const engRow2 = engineeringAchievers.slice(Math.ceil(engineeringAchievers.length / 2));

  const medRow1 = medicalAchievers.slice(0, Math.ceil(medicalAchievers.length / 2));
  const medRow2 = medicalAchievers.slice(Math.ceil(medicalAchievers.length / 2));

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <PublicNavbar />

      {/* --- SECTION 1: HOME --- */}
      <section id="home" className="pt-32 pb-24 px-6 min-h-screen flex flex-col justify-center items-center bg-[#0B1120] relative overflow-hidden text-white">
        {/* Advanced Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-16 xl:gap-24 items-center relative z-10 px-4 md:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start z-20">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 text-orange-400 font-bold text-sm border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.15)] backdrop-blur-md hover:bg-white/10 hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-all cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              Admissions Open for 2026-2027
            </div>
            
            {/* Tagline */}
            <h2 className="text-xl sm:text-2xl font-bold text-blue-300 tracking-wide">
              Learn Smarter. Aim Higher. Achieve More.
            </h2>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70">
              Empower Your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                Educational Journey
              </span>
            </h1>
            
            {/* Subtitle / Description */}
            <p className="text-lg sm:text-xl text-blue-100/80 max-w-2xl leading-relaxed font-medium">
              Build a strong foundation for your future with Vision Academy. Learn from experienced faculty through expert guidance, interactive classes, regular mock tests, doubt-solving sessions, and result-oriented preparation designed to help every student achieve academic excellence.
            </p>

            {/* Highlight Line */}
            <div className="py-2 px-6 border-l-4 border-orange-500 bg-gradient-to-r from-orange-500/10 to-transparent">
              <p className="text-xl font-bold text-white tracking-wide">Your Dream. Our Guidance. Your Success.</p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto">
              {!authLoading && user ? (
                <Link href={role === "admin" || role === "super_admin" ? "/admin" : role === "parent" ? "/parent" : "/student"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_45px_rgba(59,130,246,0.6)] hover:from-blue-400 hover:to-blue-500 hover:-translate-y-1 transition-all duration-300 border border-blue-400/50">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_45px_rgba(249,115,22,0.6)] hover:from-orange-400 hover:to-orange-500 hover:-translate-y-1 transition-all duration-300 border border-orange-400/50">
                    Start Learning Now
                  </Button>
                </Link>
              )}
              <Link href="#classes" onClick={(e) => { e.preventDefault(); document.querySelector('#classes')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full border border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-md shadow-lg hover:-translate-y-1 transition-all duration-300">
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Quick Stats - Glassmorphism Container */}
            <div className="flex items-center justify-between gap-4 sm:gap-8 pt-6 pb-6 px-6 sm:px-10 mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-center relative z-10">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-md">10K+</p>
                <p className="text-[11px] sm:text-[13px] font-bold text-blue-200/70 uppercase tracking-widest mt-1">Students</p>
              </div>
              <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/20 to-transparent relative z-10"></div>
              <div className="text-center relative z-10">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-md">50+</p>
                <p className="text-[11px] sm:text-[13px] font-bold text-blue-200/70 uppercase tracking-widest mt-1">Expert Faculty</p>
              </div>
              <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/20 to-transparent relative z-10 hidden sm:block"></div>
              <div className="text-center relative z-10 hidden sm:block">
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-md">99%</p>
                <p className="text-[11px] sm:text-[13px] font-bold text-blue-200/70 uppercase tracking-widest mt-1">Success Rate</p>
              </div>
            </div>
            {/* For mobile success rate */}
            <div className="flex sm:hidden justify-center w-full mt-2">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-md">99%</p>
                  <p className="text-[11px] font-bold text-blue-200/70 uppercase tracking-widest mt-1">Success Rate</p>
                </div>
            </div>
          </motion.div>

          {/* Right Side - Dashboard Mockup Cluster */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="relative hidden lg:block h-[650px] w-full">
            {/* Glowing Backdrop for Dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-orange-500/10 rounded-full blur-3xl z-0 pointer-events-none mix-blend-screen"></div>

            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Dashboard Card */}
              <div className="absolute w-[95%] max-w-[550px] bg-[#0f172a]/80 backdrop-blur-3xl rounded-3xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] border border-white/10 p-8 z-20 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                {/* Header Mock */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Interactive Classes</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner border border-blue-500/20"><BookOpen className="w-8 h-8" /></div>
                  <div>
                    <p className="font-extrabold text-white text-2xl">Current Lecture</p>
                    <p className="text-base font-medium text-blue-300/80 mt-1">Mathematics - Calculus Integration</p>
                  </div>
                </div>

                {/* Video Player Mockup */}
                <div className="w-full bg-[#0a0f1c] h-52 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden border border-white/5 group shadow-inner">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-orange-500/20 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                   
                   {/* Play Button */}
                   <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center pl-1.5 text-white border border-white/30 group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-400 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] transition-all duration-300 cursor-pointer z-10">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                   </div>

                   {/* Video controls mock */}
                   <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="w-4 h-4 bg-white/60 rounded-full"></div>
                     <div className="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                       <div className="h-full bg-orange-500 w-[45%]"></div>
                     </div>
                   </div>
                </div>

                <div className="space-y-4 px-1">
                  <div className="flex justify-between text-[14px] font-bold text-blue-200/80">
                    <span>Performance Tracking</span>
                    <span className="text-orange-400">70% Mastered</span>
                  </div>
                  <div className="h-3 bg-[#0a0f1c] rounded-full w-full overflow-hidden border border-white/5 shadow-inner">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-[70%] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)] relative">
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1 - Top Right */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute top-[2%] right-[-8%] bg-[#0f172a]/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 p-5 z-30 flex items-center gap-4 hover:border-green-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/10 rounded-xl flex items-center justify-center text-green-400 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]"><Trophy className="w-6 h-6" /></div>
                <div>
                  <p className="font-extrabold text-white text-[16px]">Top Scorer</p>
                  <p className="text-[13px] font-medium text-blue-200/70 mt-0.5">Achievement Unlocked!</p>
                </div>
              </motion.div>

              {/* Floating Element 2 - Bottom Left */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                className="absolute bottom-[2%] left-[-8%] bg-[#0f172a]/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 p-5 z-30 flex items-center gap-4 hover:border-orange-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-amber-500/10 rounded-xl flex items-center justify-center text-orange-400 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><Clock className="w-6 h-6" /></div>
                <div>
                  <p className="font-extrabold text-white text-[16px]">Upcoming Mock Test</p>
                  <p className="text-[13px] font-medium text-blue-200/70 mt-0.5">Physics - Thermodynamics</p>
                </div>
              </motion.div>
              
              {/* Floating Element 3 - Top Left (Doubt Solving) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                className="absolute top-[18%] left-[-12%] bg-[#0f172a]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 p-4 z-30 flex items-center gap-3 hover:border-blue-400/50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/30"><MessageCircle className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold text-white text-[14px]">Doubt Solved</p>
                  <p className="text-[11px] font-medium text-blue-200/70">Expert replied 2m ago</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Features Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full max-w-[1920px] mx-auto mt-20 relative z-10 px-4 md:px-6 lg:px-8">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition-all text-left flex flex-col group cursor-pointer hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
              <BookOpen className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] relative z-10" />
              <h3 className="font-extrabold text-white text-xl mb-3 relative z-10">Expert Faculty</h3>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed relative z-10">Learn from experienced and dedicated educators.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 hover:border-orange-400/40 hover:bg-white/10 transition-all text-left flex flex-col group cursor-pointer hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
              <Video className="w-12 h-12 text-orange-400 mb-6 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-[0_0_15px_rgba(251,146,60,0.5)] relative z-10" />
              <h3 className="font-extrabold text-white text-xl mb-3 relative z-10">Interactive Live Classes</h3>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed relative z-10">Engaging classes designed for better understanding.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition-all text-left flex flex-col group cursor-pointer hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
              <FileText className="w-12 h-12 text-blue-400 mb-6 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] relative z-10" />
              <h3 className="font-extrabold text-white text-xl mb-3 relative z-10">Regular Mock Tests</h3>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed relative z-10">Practice with exam-oriented tests and performance analysis.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-white/10 hover:border-orange-400/40 hover:bg-white/10 transition-all text-left flex flex-col group cursor-pointer hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none"></div>
              <MessageCircle className="w-12 h-12 text-orange-400 mb-6 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-[0_0_15px_rgba(251,146,60,0.5)] relative z-10" />
              <h3 className="font-extrabold text-white text-xl mb-3 relative z-10">Personalized Doubt Solving</h3>
              <p className="text-blue-100/70 text-sm font-medium leading-relaxed relative z-10">Get your doubts resolved with expert guidance.</p>
            </div>
        </div>
      </section>

      {/* --- SECTION 2: ABOUT US --- */}
      <section id="about" className="py-24 px-6 relative overflow-hidden bg-white">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-[1920px] mx-auto relative z-10 px-4 md:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h4 className="text-orange-500 font-bold uppercase tracking-wider mb-2">Discover Our Story</h4>
            <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">About Vision Academy</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full shadow-lg shadow-orange-500/20"></div>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Empowering Minds, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Transforming Futures.</span>
              </h3>
              <p className="text-lg text-gray-900 leading-relaxed font-medium">
                What started as a small, passionate classroom has blossomed into a premier educational institution. At Vision Academy, we believe that every student has untapped potential waiting to be discovered.
              </p>
              <p className="text-lg text-gray-900 leading-relaxed">
                We realized that traditional learning needed a significant upgrade—so we combined expert pedagogy with a cutting-edge Learning Management System. Our unique approach ensures personalized attention, rigorous testing, and continuous constructive feedback.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">5000+</h4>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Happy Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                    <Star className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">15+</h4>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Years Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4"
            >
               <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl text-center shadow-lg border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                 <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/30 rotate-3">
                   <Target className="w-8 h-8" />
                 </div>
                 <h4 className="font-extrabold text-xl text-blue-900 mb-2">Excellence</h4>
                 <p className="text-sm text-gray-600">Striving for the highest academic standards in every subject.</p>
               </div>
               
               <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-3xl text-center shadow-lg border border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mt-8">
                 <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-orange-500/30 -rotate-3">
                   <Lightbulb className="w-8 h-8" />
                 </div>
                 <h4 className="font-extrabold text-xl text-blue-900 mb-2">Innovation</h4>
                 <p className="text-sm text-gray-600">Modern teaching methods paired with advanced tech.</p>
               </div>
               
               <div className="bg-gradient-to-br from-cyan-50 to-white p-8 rounded-3xl text-center shadow-lg border border-cyan-100 col-span-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                   <div className="w-16 h-16 bg-cyan-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/30">
                     <Heart className="w-8 h-8" />
                   </div>
                   <div className="text-center md:text-left">
                     <h4 className="font-extrabold text-2xl text-blue-900 mb-2">Dedication to Students</h4>
                     <p className="text-gray-600">Our students' success is our ultimate reward. We nurture each individual's journey with care, mentorship, and unwavering support.</p>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>

          {/* --- ANIMATED FEATURE CARDS --- */}
          <div className="mt-28 w-full overflow-hidden pause-on-hover relative [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            
            {/* Row 1 (Right to Left) */}
            <div className="flex w-max animate-marquee-left mb-8 gap-6 pl-6">
              {[...Array(4)].flatMap(() => [
                { name: "Live Classes", icon: MonitorPlay, color: "text-blue-500", borderHover: "hover:border-blue-300" },
                { name: "24×7 Doubt Solving", icon: MessageCircleQuestion, color: "text-orange-500", borderHover: "hover:border-orange-300" },
                { name: "Mock Tests", icon: ClipboardList, color: "text-cyan-500", borderHover: "hover:border-cyan-300" },
                { name: "Career Guidance", icon: Compass, color: "text-blue-600", borderHover: "hover:border-blue-400" },
              ]).map((item, i) => (
                <div key={i} className={`flex-none bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pr-8 pl-3 py-3 flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] ${item.borderHover} transition-all cursor-default`}>
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-extrabold text-[17px] text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Row 2 (Left to Right) */}
            <div className="flex w-max animate-marquee-right mb-8 gap-6 pl-20">
              {[...Array(4)].flatMap(() => [
                { name: "PYQ Tests", icon: History, color: "text-orange-500", borderHover: "hover:border-orange-300" },
                { name: "Improvement Book", icon: TrendingUp, color: "text-blue-500", borderHover: "hover:border-blue-300" },
                { name: "Revision & Doubt Solving Session", icon: RefreshCw, color: "text-cyan-500", borderHover: "hover:border-cyan-300" },
              ]).map((item, i) => (
                <div key={i} className={`flex-none bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pr-8 pl-3 py-3 flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] ${item.borderHover} transition-all cursor-default`}>
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-extrabold text-[17px] text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Row 3 (Right to Left) */}
            <div className="flex w-max animate-marquee-left gap-6 pl-12">
              {[...Array(4)].flatMap(() => [
                { name: "Topic-wise Tests", icon: Layers, color: "text-cyan-500", borderHover: "hover:border-cyan-300" },
                { name: "Regular Homework", icon: BookOpen, color: "text-orange-500", borderHover: "hover:border-orange-300" },
                { name: "Subjective Tests", icon: Edit3, color: "text-blue-500", borderHover: "hover:border-blue-300" },
                { name: "Special Guest Sessions", icon: Mic, color: "text-orange-600", borderHover: "hover:border-orange-400" },
              ]).map((item, i) => (
                <div key={i} className={`flex-none bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full pr-8 pl-3 py-3 flex items-center gap-4 group hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] ${item.borderHover} transition-all cursor-default`}>
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="font-extrabold text-[17px] text-gray-700 group-hover:text-gray-900 transition-colors whitespace-nowrap">{item.name}</span>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>

      {/* --- SECTION 3: OUR CLASSES --- */}
      <section id="classes" className="py-24 px-6 relative overflow-hidden bg-[#f8fafc]">
        {/* Massive vibrant orbs for the mesh gradient effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-400 via-cyan-300 to-transparent rounded-full blur-[120px] opacity-60 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-tl from-orange-400 via-pink-300 to-transparent rounded-full blur-[120px] opacity-60 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute top-[10%] left-[30%] w-[600px] h-[600px] bg-gradient-to-tr from-purple-400 to-indigo-300 rounded-full blur-[140px] opacity-50 mix-blend-multiply pointer-events-none"></div>
        
        <div className="w-full max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">Our Classes & Programs</h2>
            <div className="w-32 h-2 bg-gradient-to-r from-blue-600 via-purple-500 to-orange-500 mx-auto rounded-full shadow-lg"></div>
            <p className="text-xl text-slate-700 mt-8 max-w-2xl mx-auto font-bold leading-relaxed">
              We offer specialized batches tailored to your academic goals. Aim for top engineering/medical colleges or excel in board exams.
            </p>
          </div>
          
          <div className="flex flex-col gap-10">
            
            {/* Integrated Batch - Horizontal Frosted Glass Card */}
            <div className="relative w-full p-8 lg:p-12 rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              
              {/* Subtle Edge Highlight */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
              
              {/* Left Side: Header & CTA */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-blue-50 flex items-center justify-center shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500 mb-8">
                  <Target className="w-12 h-12 text-blue-600 drop-shadow-sm" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Integrated Batch</h3>
                <div className="inline-flex items-center justify-center px-5 py-2 mt-4 mb-10 rounded-full bg-blue-600 text-white font-extrabold text-sm tracking-widest uppercase shadow-md group-hover:bg-blue-700 transition-colors">
                  11th & 12th JEE / NEET
                </div>
                
                <Link href="#contact" className="w-full sm:w-auto" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Button className="w-full sm:w-56 h-16 text-xl font-extrabold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.4)] transition-all duration-300 hover:scale-[1.03]">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block w-[2px] h-64 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-50"></div>
              
              {/* Horizontal Divider (Mobile/Tablet) */}
              <div className="block lg:hidden w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>

              {/* Right Side: Features Grid */}
              <div className="flex-[1.5] w-full z-10">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {["Daily Live & Recorded Lectures", "Comprehensive Study Material", "Weekly Mock Tests", "Doubt Solving Sessions", "Personalized Mentorship"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors border border-transparent hover:border-white/50 cursor-default">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-blue-600 shrink-0 border border-blue-50">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-slate-800 font-extrabold text-[17px] leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Regular Batch - Horizontal Frosted Glass Card */}
            <div className="relative w-full p-8 lg:p-12 rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/80 shadow-[0_8px_40px_rgb(0,0,0,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              
              {/* Subtle Edge Highlight */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
              
              {/* Left Side: Header & CTA */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-orange-50 flex items-center justify-center shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500 mb-8">
                  <Award className="w-12 h-12 text-orange-500 drop-shadow-sm" />
                </div>
                
                <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Regular Batch</h3>
                <div className="inline-flex items-center justify-center px-5 py-2 mt-4 mb-10 rounded-full bg-orange-500 text-white font-extrabold text-sm tracking-widest uppercase shadow-md group-hover:bg-orange-600 transition-colors">
                  State Board Excellence
                </div>
                
                <Link href="#contact" className="w-full sm:w-auto" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <Button className="w-full sm:w-56 h-16 text-xl font-extrabold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-[0_8px_20px_rgba(15,23,42,0.3)] hover:shadow-[0_12px_30px_rgba(15,23,42,0.4)] transition-all duration-300 hover:scale-[1.03]">
                    Enquire Now
                  </Button>
                </Link>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block w-[2px] h-64 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-50"></div>
              
              {/* Horizontal Divider (Mobile/Tablet) */}
              <div className="block lg:hidden w-full h-[2px] bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-50"></div>

              {/* Right Side: Features Grid */}
              <div className="flex-[1.5] w-full z-10">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {["Detailed Syllabus Coverage", "Chapter-wise Notes", "Monthly Assessments", "Previous Year Question Analysis", "Practical Exam Guidance"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-colors border border-transparent hover:border-white/50 cursor-default">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm text-orange-500 shrink-0 border border-orange-50">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <span className="text-slate-800 font-extrabold text-[17px] leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* --- SECTION 4.5: OUR FACULTY --- */}
      <section id="faculty" className="py-24 px-6 bg-blue-50">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Our Faculty</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">Learn from highly experienced and dedicated teachers committed to your success.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { name: "Santosh Sir", subject: "English" },
              { name: "Mayur Sir", subject: "Mathematics" },
              { name: "Prem Sir", subject: "Chemistry" },
              { name: "Pranav Sir", subject: "Physics" },
              { name: "Sagar Sir", subject: "Physics" },
              { name: "Amol Sir", subject: "Biology" },
              { name: "Avinash Sir", subject: "Chemistry" }
            ].map((faculty, idx) => (
              <Card key={idx} className="border border-transparent shadow-md bg-white hover:-translate-y-2 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group w-[160px] sm:w-[180px] md:w-[220px] lg:w-[240px] xl:flex-1 xl:min-w-[180px] xl:max-w-[260px] flex-shrink-0">
                <CardContent className="pt-8 px-4 pb-8 flex flex-col items-center text-center h-full justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-blue-50 bg-blue-100 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <User className="w-12 h-12 sm:w-14 sm:h-14" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-blue-900 group-hover:text-blue-700 transition-colors">{faculty.name}</h3>
                  <p className="text-orange-500 font-bold text-base sm:text-lg mt-2 uppercase tracking-wide">{faculty.subject}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4.6: OUR RESULTS --- */}
      <section id="results" className="py-24 px-6 bg-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Our Star Achievers</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">Celebrating the outstanding success of Vision Academy students in Medical and Engineering fields.</p>
          </div>

          <div className="space-y-16 mt-8 w-full">
            {/* Engineering Achievements */}
            <div className="w-full">
              <h3 className="text-2xl font-bold text-orange-500 mb-8 text-center md:text-left">Engineering Achievements</h3>
              
              <div className="flex flex-col gap-6 w-full">
                {/* Row 1 */}
                <div className="flex overflow-hidden w-full max-w-[100vw] pause-on-hover">
                  <div className="flex w-max animate-marquee-left" style={{ animationDuration: '35s' }}>
                    <div className="flex gap-6 px-3">
                      {engRow1.map((student, idx) => renderAchieverCard(student, "Engineering", "bg-emerald-100 text-emerald-700", `eng1-${idx}`))}
                    </div>
                    <div className="flex gap-6 px-3">
                      {engRow1.map((student, idx) => renderAchieverCard(student, "Engineering", "bg-emerald-100 text-emerald-700", `eng1-dup-${idx}`))}
                    </div>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="flex overflow-hidden w-full max-w-[100vw] pause-on-hover">
                  <div className="flex w-max animate-marquee-left" style={{ animationDuration: '45s' }}>
                    <div className="flex gap-6 px-3">
                      {engRow2.map((student, idx) => renderAchieverCard(student, "Engineering", "bg-emerald-100 text-emerald-700", `eng2-${idx}`))}
                    </div>
                    <div className="flex gap-6 px-3">
                      {engRow2.map((student, idx) => renderAchieverCard(student, "Engineering", "bg-emerald-100 text-emerald-700", `eng2-dup-${idx}`))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Achievements */}
            <div className="w-full">
              <h3 className="text-2xl font-bold text-orange-500 mb-8 text-center md:text-left">Medical Achievements</h3>
              
              <div className="flex flex-col gap-6 w-full">
                {/* Row 1 */}
                <div className="flex overflow-hidden w-full max-w-[100vw] pause-on-hover">
                  <div className="flex w-max animate-marquee-left" style={{ animationDuration: '35s' }}>
                    <div className="flex gap-6 px-3">
                      {medRow1.map((student, idx) => renderAchieverCard(student, "Medical", "bg-blue-200 text-blue-800", `med1-${idx}`))}
                    </div>
                    <div className="flex gap-6 px-3">
                      {medRow1.map((student, idx) => renderAchieverCard(student, "Medical", "bg-blue-200 text-blue-800", `med1-dup-${idx}`))}
                    </div>
                  </div>
                </div>
                
                {/* Row 2 */}
                <div className="flex overflow-hidden w-full max-w-[100vw] pause-on-hover">
                  <div className="flex w-max animate-marquee-left" style={{ animationDuration: '45s' }}>
                    <div className="flex gap-6 px-3">
                      {medRow2.map((student, idx) => renderAchieverCard(student, "Medical", "bg-blue-200 text-blue-800", `med2-${idx}`))}
                    </div>
                    <div className="flex gap-6 px-3">
                      {medRow2.map((student, idx) => renderAchieverCard(student, "Medical", "bg-blue-200 text-blue-800", `med2-dup-${idx}`))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/achievements">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg border border-orange-400/50 transition-all hover:-translate-y-1">
                Explore Detailed Achievements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: CONTACT --- */}
      <section id="contact" className="py-24 px-6 bg-blue-900 text-white">
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Contact Us</h2>
            <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
            <p className="text-lg mt-6 text-blue-100">Get in touch with us for any inquiries about our courses, batches, or admission process.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 w-full">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-orange-400">Direct Contacts</h3>
              <div className="space-y-4">
                <a href="https://maps.app.goo.gl/JhB5MSH4zrMmMTdy8?g_st=aw" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 bg-blue-800 p-5 rounded-2xl border border-blue-700 hover:bg-blue-700 hover:border-orange-400 transition-all group cursor-pointer block">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-white transition-colors">Branch 1</p>
                      <p className="text-blue-200 group-hover:text-blue-100 transition-colors">
                        Karmare Complex, Above Hotel Saikrupa, Pabal Road, Rajgurunagar.
                      </p>
                    </div>
                  </div>
                </a>
                <div className="flex items-start gap-4 bg-blue-800 p-5 rounded-2xl border border-blue-700">
                  <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-orange-400 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Branch 2</p>
                    <p className="text-blue-200">K.T.E.S. School, Near Post Office Road, Wada Road, Rajgurunagar.</p>
                  </div>
                </div>
                {contacts.map((contact, i) => (
                  <div key={i} className="flex items-center gap-4 bg-blue-800 p-5 rounded-2xl border border-blue-700">
                    <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-orange-400">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">{contact.name}</p>
                      <a href={`tel:${contact.phone.replace(/ /g, "")}`} className="text-blue-200 hover:text-white transition-colors">{contact.phone}</a>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 bg-blue-800 p-5 rounded-2xl border border-blue-700">
                  <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-orange-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Email Us</p>
                    <a href="mailto:pritishjadhav2006@gmail.com" className="text-blue-200 hover:text-white transition-colors">pritishjadhav2006@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-blue-800 p-5 rounded-2xl border border-blue-700">
                  <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center text-pink-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Follow Us on Instagram</p>
                    <a href="https://www.instagram.com/visionacademy_?igsh=MTR5ZHlrejkybzFpcw==" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">@visionacademy_</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="bg-white text-gray-900 shadow-2xl rounded-2xl p-8 border-t-8 border-orange-500">
                <h3 className="text-2xl font-bold mb-6 text-blue-900">Send an Enquiry</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <Input {...register("fullName")} placeholder="John Doe" className={`bg-gray-50 border-gray-200 h-12 ${errors.fullName ? "border-red-500" : ""}`} />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email Address</label>
                    <Input {...register("email")} type="email" placeholder="john@example.com" className={`bg-gray-50 border-gray-200 h-12 ${errors.email ? "border-red-500" : ""}`} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Enquiry Message</label>
                    <textarea {...register("message")} className={`flex min-h-[140px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${errors.message ? "border-red-500" : ""}`} placeholder="How can we help you?" />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-bold rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 mt-4 shadow-lg">
                    <Send className="w-5 h-5" /> Send Enquiry
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
