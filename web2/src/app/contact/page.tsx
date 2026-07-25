"use client";

import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/PublicNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

import { useState } from "react";

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset(); // Clear form fields only on success
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    }
  };

  const contacts = [
    { name: "Santosh Sir", phone: "+91 9970282728" },
    { name: "Mayur Sir", phone: "+91 7755999944" },
    { name: "Prem Sir", phone: "+91 8600575681" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PublicNavbar />

      <main className="flex-1 flex flex-col items-center px-4 md:px-6 lg:px-8 py-6 pt-32 w-full max-w-[1920px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-lg">
            Get in touch with us for any inquiries about our courses, batches, or admission process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 w-full">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold">Get In Touch</h2>
            <div className="space-y-4">
              {contacts.map((contact, i) => (
                <Card key={i} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <a href={`tel:${contact.phone.replace(/ /g, "")}`} className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <a href="mailto:pritishjadhav2006@gmail.com" className="text-zinc-600 dark:text-zinc-400 hover:text-primary transition-colors">
                      pritishjadhav2006@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </div>
                  <div>
                    <p className="font-semibold">Follow Us on Instagram</p>
                    <a 
                      href="https://www.instagram.com/visionacademy_?igsh=MTR5ZHlrejkybzFpcw==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-zinc-600 dark:text-zinc-400 hover:text-pink-600 transition-colors"
                    >
                      @visionacademy_
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Send an Enquiry</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    {...register("fullName")} 
                    placeholder="John Doe" 
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    {...register("email")} 
                    type="email" 
                    placeholder="john@example.com" 
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Enquiry Message</label>
                  <textarea 
                    {...register("message")}
                    className={`flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${errors.message ? "border-red-500" : ""}`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 text-base mt-2 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> 
                  {isSubmitting ? "Sending..." : "Send Enquiry"}
                </Button>

                {submitStatus === "success" && (
                  <div className="p-3 mt-4 text-sm text-green-800 bg-green-100 border border-green-300 rounded-md">
                    Your message has been sent successfully! You will receive a reply within 48 hours.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="p-3 mt-4 text-sm text-red-800 bg-red-100 border border-red-300 rounded-md">
                    Failed to send your message. Please try again.
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
