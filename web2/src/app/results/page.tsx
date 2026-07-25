"use client";

import { PublicNavbar } from "@/components/PublicNavbar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Star } from "lucide-react";
import Image from "next/image";

export default function ResultsPage() {
  const results: any[] = [];

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
            Our <span className="text-primary">Results</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            We don't just make promises; we deliver results. Meet our outstanding achievers who have set new benchmarks in competitive exams.
          </motion.p>
        </div>

        {/* Results Grid */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((student, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white dark:bg-zinc-900 overflow-hidden relative">
                {/* Accent Header */}
                <div className="h-24 bg-gradient-to-r from-primary to-secondary w-full absolute top-0 left-0 opacity-10"></div>

                <CardContent className="pt-8 px-6 pb-8 flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-md overflow-hidden mb-4 relative bg-zinc-200">
                    <Image
                      src={student.image}
                      alt={student.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex items-center gap-1 mb-2 text-secondary">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{student.name}</h3>
                  <p className="text-primary font-semibold text-sm mt-1">{student.achievement}</p>

                  <div className="mt-3 inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">
                    <Award className="w-4 h-4" />
                    {student.score}
                  </div>

                  <blockquote className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 italic relative">
                    <span className="text-3xl text-primary/20 absolute -top-4 -left-2">"</span>
                    {student.quote}
                    <span className="text-3xl text-primary/20 absolute -bottom-6 -right-2">"</span>
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-24">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Be Our Next Topper!</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Admissions for the upcoming batches are now open. Enroll today and start your journey towards excellence.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
