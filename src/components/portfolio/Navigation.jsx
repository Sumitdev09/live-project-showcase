import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation({ profile }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navItems.map(item => item.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#e8e8e8]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1"
            >
              <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-[#1A1A1A]' : 'text-white'}`}>
                {profile?.full_name || 'Portfolio'}
              </span>
              <span className="text-[#8B1A1A] text-2xl font-black">.</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 ${
              isScrolled
                ? 'bg-white border border-[#eee] shadow-sm'
                : 'bg-white/10 border border-white/15 backdrop-blur-sm'
            }`}>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-white'
                      : isScrolled ? 'text-[#444] hover:text-[#1a1a1a]' : 'text-white/75 hover:text-white'
                  }`}
                >
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-[#8B1A1A] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Resume Button */}
            <div className="hidden md:flex items-center gap-4">
              {profile?.resume_url && (
                <Button
                  asChild
                  className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-full font-medium shadow-md shadow-[#8B1A1A]/20"
                >
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                  </a>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-[#8B1A1A] text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <div className="pt-28 px-6">
              <div className="flex flex-col gap-3">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.href)}
                    className="text-left text-2xl font-semibold text-[#1A1A1A] py-4 px-6 rounded-2xl hover:bg-[#8B1A1A]/10 transition-colors"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
             
              {profile?.resume_url && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Button
                    asChild
                    className="w-full bg-[#8B1A1A] rounded-full h-14 text-lg font-medium"
                  >
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-5 h-5 mr-2" />
                      Download Resume
                    </a>
                  </Button>
                </motion.div>
              )}

              {/* Decorative */}
              <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className={`w-3 h-3 rounded-full ${
                      i === 0 ? 'bg-[#8B1A1A]' :
                      i === 1 ? 'bg-[#1a1a1a]' :
                      i === 2 ? 'bg-[#A52828]' :
                      i === 3 ? 'bg-[#8B1A1A]' :
                      'bg-[#1a1a1a]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
