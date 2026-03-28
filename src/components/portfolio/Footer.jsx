import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 bg-[#1a1a1a] relative overflow-hidden">
      {/* Top line - Luique style */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#333]" />
     
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <motion.span
              whileHover={{ scale: 1.02 }}
              className="text-xl font-semibold tracking-wider uppercase text-white"
            >
              {profile?.full_name?.split(' ')[0] || 'Portfolio'}
              <span className="text-[#8B1A1A]">.</span>
            </motion.span>
            <p className="text-[#666666] text-sm">
              © {currentYear} All rights reserved.
            </p>
            <Link
              to={createPageUrl('AdminLogin')}
              className="text-[#444444] hover:text-[#8B1A1A] transition-colors flex items-center gap-1 text-sm"
            >
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
         
          <div className="hidden md:flex items-center gap-2 text-[#666666] text-sm">
            Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-[#8B1A1A] fill-current" />
            </motion.span>
          </div>
         
          <div className="flex items-center gap-6">
            <p className="text-[#666666] text-sm">
              Design & Develop by Sumit Yadav <span className="text-[#8B1A1A]">X</span> Janhavi Dev
            </p>
           
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 border border-[#333] rounded-full flex items-center justify-center text-white hover:border-[#8B1A1A] hover:text-[#8B1A1A] transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}

