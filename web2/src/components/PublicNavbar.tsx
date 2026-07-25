"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { MEDIA } from "@/lib/assets";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Our Classes", href: "#classes" },
    { name: "Our Faculty", href: "#faculty" },
    { name: "Our Results", href: "#results" },
    { name: "Contact", href: "#contact" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (window.location.pathname !== "/") {
      window.location.href = `/${href}`;
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl fixed top-0 w-full z-50 transition-all duration-300">
      <Link href="#home" onClick={(e) => handleScroll(e, "#home")} className="font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white">
          <Image src={MEDIA.general.logo} alt="Vision Academy Logo" fill className="object-cover" />
        </div>
        VISION ACADEMY
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="text-lg font-bold transition-all hover:text-orange-400 text-slate-300 tracking-wide hover:-translate-y-0.5"
          >
            {link.name}
          </a>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        <Link href="/login">
          <Button variant="outline" className="h-10 px-6 font-bold bg-white/5 backdrop-blur-sm text-white border-white/20 hover:bg-white/10 hover:text-white transition-all shadow-sm">Log In</Button>
        </Link>
        <Link href="/signup">
          <Button className="h-10 px-6 font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:from-orange-400 hover:to-orange-500 transition-all">Sign Up</Button>
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-orange-400 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Drawer */}
          <div
            className="fixed top-0 left-0 w-[75%] max-w-[320px] h-full bg-[#0B1120] shadow-2xl flex flex-col p-6 overflow-y-auto transform transition-transform duration-300 border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-extrabold text-xl text-white tracking-widest">MENU</span>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-orange-400 bg-white/10 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-lg font-bold text-slate-300 hover:text-orange-400 transition-colors border-b border-white/10 pb-4"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-auto pt-8">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white/10">Log In</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-12 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-orange-400/50 hover:from-orange-400 hover:to-orange-500 text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
