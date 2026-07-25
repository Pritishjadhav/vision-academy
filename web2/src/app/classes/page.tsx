"use client";

import { PublicNavbar } from "@/components/PublicNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ClassesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PublicNavbar />
      
      <main className="flex-1 flex flex-col pt-32 pb-24">
        {/* Header */}
        <div className="text-center px-6 max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Our <span className="text-secondary">Programs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            We offer specialized batches tailored to your academic goals. Whether you are aiming for top engineering/medical colleges or excelling in board exams, we have a plan for you.
          </motion.p>
        </div>

        {/* Pricing/Classes Cards */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
          
          {/* Integrated Batch */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-2 border-primary shadow-xl bg-white dark:bg-zinc-900 h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              <CardHeader className="text-center pb-8 pt-10 border-b dark:border-zinc-800">
                <CardTitle className="text-2xl font-bold text-primary">Integrated Batch</CardTitle>
                <p className="text-sm text-zinc-500 mt-2">11th & 12th JEE / NEET Preparation</p>
                <div className="mt-6 flex justify-center items-baseline">
                   <span className="text-5xl font-extrabold tracking-tight">Focus</span>
                </div>
              </CardHeader>
              <CardContent className="pt-8 flex-1">
                <ul className="space-y-4">
                  {[
                    "Daily Live & Recorded Lectures",
                    "Comprehensive Study Material",
                    "Weekly Mock Tests (Anti-Cheat enabled)",
                    "Doubt Solving Sessions",
                    "Personalized Mentorship",
                    "Board Exam Preparation Included"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-8">
                <Link href="/contact" className="w-full">
                  <Button className="w-full h-12 text-lg rounded-full">Enquire Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Regular Batch */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-zinc-50 dark:bg-zinc-900/50 h-full flex flex-col">
              <CardHeader className="text-center pb-8 pt-10 border-b dark:border-zinc-800">
                <CardTitle className="text-2xl font-bold text-secondary">Regular Batch</CardTitle>
                <p className="text-sm text-zinc-500 mt-2">State Board Excellence</p>
                <div className="mt-6 flex justify-center items-baseline">
                   <span className="text-5xl font-extrabold tracking-tight">Board</span>
                </div>
              </CardHeader>
              <CardContent className="pt-8 flex-1">
                <ul className="space-y-4">
                  {[
                    "Detailed Syllabus Coverage",
                    "Chapter-wise Notes",
                    "Monthly Assessments",
                    "Previous Year Question Analysis",
                    "Practical Exam Guidance"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                      <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-8">
                <Link href="/contact" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg rounded-full border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    Enquire Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
