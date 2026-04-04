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
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative maroon circles */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.05) 0%, transparent 70%)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Initials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-6"
        >
          <span className="font-caveat text-7xl md:text-8xl font-bold tracking-tight"
            style={{ color: '#8B1A1A' }}>
            S<span style={{ color: '#A52828' }}>Y</span>
          </span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mb-8 text-sm tracking-[0.2em] uppercase font-jost"
          style={{ color: '#8B1A1A', opacity: 0.6 }}
        >
          Portfolio
        </motion.p>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10 w-48 h-[3px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(139,26,26,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8B1A1A, #A52828, #8B1A1A)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Three bouncing dots */}
        <div className="relative z-10 mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: '#8B1A1A' }}
              animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </div>
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
