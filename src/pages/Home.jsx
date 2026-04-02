import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

import Navigation from '@/components/portfolio/Navigation';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import CareerSection from '@/components/portfolio/CareerSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';

import Footer from '@/components/portfolio/Footer';
import SectionDivider from '@/components/portfolio/SectionDivider';

export default function Home() {
  const { data: profiles, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const { data: experiences } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => base44.entities.Experience.list(),
  });

  const { data: education } = useQuery({
    queryKey: ['education'],
    queryFn: () => base44.entities.Education.list(),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
  });

  const { data: posts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list(),
  });

  const profile = profiles?.[0];

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #9EB89D 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Initials */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 mb-8"
        >
          <span className="font-caveat text-6xl md:text-7xl font-bold text-white tracking-tight">
            S<span style={{ color: '#9EB89D' }}>Y</span>
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7A9A79, #B8D4B8)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-5 text-white/40 text-xs tracking-[0.3em] uppercase font-jost"
        >
          Loading Portfolio
        </motion.p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6]">
      <Navigation profile={profile} />
      <HeroSection profile={profile} />
      <SectionDivider />
      <AboutSection profile={profile} />
      <SkillsSection />
      <CareerSection experiences={experiences || []} education={education || []} profile={profile} />
      <ProjectsSection projects={projects || []} />
      <BlogSection posts={posts || []} />
      <ContactSection profile={profile} />
      
      <Footer profile={profile} />
    </div>
  );
}
