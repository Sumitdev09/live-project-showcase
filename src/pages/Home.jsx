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
import CertificatesSection from '@/components/portfolio/CertificatesSection';

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

  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
  });

  const { data: posts } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.list(),
  });

  const profile = profiles?.[0];

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Animated background particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 3 === 0 ? '#8B1A1A' : i % 3 === 1 ? '#A52828' : 'rgba(255,255,255,0.15)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Large maroon ambient glow */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,26,26,0.25) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full translate-x-32 -translate-y-20"
          style={{ background: 'radial-gradient(circle, rgba(165,40,40,0.15) 0%, transparent 70%)' }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Rotating ring */}
        <motion.div
          className="absolute w-[200px] h-[200px] rounded-full border border-white/5"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute w-[260px] h-[260px] rounded-full border border-[#8B1A1A]/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />

        {/* Initials */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-6"
        >
          <span className="font-caveat text-7xl md:text-8xl font-bold tracking-tight text-white">
            S<span style={{ color: '#8B1A1A' }}>Y</span>
          </span>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 192 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 h-[2px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6E1515, #8B1A1A, #A52828, #8B1A1A)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 mt-6 text-white/30 text-xs tracking-[0.3em] uppercase font-jost"
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
      <CertificatesSection certificates={certificates || []} />
      <BlogSection posts={posts || []} />
      <ContactSection profile={profile} />
      
      <Footer profile={profile} />
    </div>
  );
}
