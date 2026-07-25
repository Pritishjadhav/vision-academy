import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B1120] text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
      
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 relative z-10">
        {/* Brand */}
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
            Vision Academy
          </h3>
          <p className="text-blue-100/70 text-sm leading-relaxed">
            Empowering students with top-tier education, state-of-the-art LMS, and personalized mentorship to crack JEE, NEET, and Board Exams.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="https://www.instagram.com/visionacademy_?igsh=MTR5ZHlrejkybzFpcw==" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all text-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {["Home", "About Us", "Classes", "Faculty", "Results"].map((link) => (
              <li key={link}>
                <Link href={`/#${link.toLowerCase().replace(" ", "")}`} className="text-blue-100/70 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover:bg-orange-400 transition-colors"></span>
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-6">Our Programs</h4>
          <ul className="space-y-3">
            {["Integrated Batch (11th & 12th)", "JEE Main & Advanced", "NEET Medical Prep", "State Board Excellence", "Foundation Course"].map((program) => (
              <li key={program}>
                <Link href="/#classes" className="text-blue-100/70 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-orange-400 transition-colors"></span>
                  {program}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-white mb-6">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-blue-100/70">
              <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <a href="https://maps.app.goo.gl/JhB5MSH4zrMmMTdy8?g_st=aw" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">
                <strong>Branch 1:</strong> Karmare Complex, Above Hotel Saikrupa, Pabal Road, Rajgurunagar.
              </a>
            </li>
            <li className="flex items-start gap-3 text-sm text-blue-100/70">
              <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Branch 2:</strong> K.T.E.S. School, Near Post Office Road, Wada Road, Rajgurunagar.</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-blue-100/70">
              <Phone className="w-5 h-5 text-orange-400 shrink-0" />
              <span>+91 7755999944</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-blue-100/70">
              <Mail className="w-5 h-5 text-orange-400 shrink-0" />
              <a href="mailto:pritishjadhav2006@gmail.com" className="hover:text-orange-400 transition-colors">pritishjadhav2006@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 relative z-10">
        <p className="text-center text-sm text-blue-100/50">
          © {new Date().getFullYear()} Vision Academy. All rights reserved. Designed for Excellence.
        </p>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none"></div>
    </footer>
  );
}
