"use client";

import { PublicNavbar } from "@/components/PublicNavbar";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb } from "lucide-react";

export default function AboutPage() {
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
            About <span className="text-primary">Vision Academy</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed"
          >
            Founded with a vision to redefine education, Vision Academy stands as a beacon of excellence for students aspiring to conquer JEE, NEET, and Board examinations.
          </motion.p>
        </div>

        {/* Story Section */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              What started as a small classroom has grown into a premier educational institution. We realized that traditional learning needed an upgrade—so we combined expert pedagogy with a cutting-edge Learning Management System. 
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Our unique approach ensures that every student gets personalized attention, rigorous testing, and continuous feedback, empowering them to achieve their highest potential.
            </p>
          </div>
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden h-full min-h-[300px]">
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-2xl"></div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
             <div className="relative z-10 h-full flex items-center justify-center">
                <span className="text-9xl opacity-10">📖</span>
             </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-white dark:bg-zinc-900 py-24">
          <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md bg-zinc-50 dark:bg-zinc-950">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Excellence</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">We strive for academic excellence in everything we do, pushing our students to reach their peak.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md bg-zinc-50 dark:bg-zinc-950">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Innovation</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">Embracing modern technology and smart learning methods to make education accessible and effective.</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-zinc-50 dark:bg-zinc-950">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-pink-500/10 rounded-full flex items-center justify-center text-pink-500">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Dedication</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">Our faculty is deeply committed to the personal and academic growth of every individual student.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Leadership */}
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Leadership Team</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">Meet the educators driving our success.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {["Santosh Sir", "Mayur Sir", "Prem Sir"].map((name) => (
              <div key={name} className="text-center space-y-4">
                <div className="w-40 h-40 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white shadow-xl flex items-center justify-center text-4xl overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20"></div>
                   👨‍🏫
                </div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-primary font-medium">Founder & Educator</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
