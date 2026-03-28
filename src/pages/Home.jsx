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
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <motion.div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className={`w-4 h-4 rounded-full ${
                i === 0 ? 'bg-[#9EB89D]' :
                i === 1 ? 'bg-[#B8D4B8]' :
                i === 2 ? 'bg-[#7A9A79]' :
                i === 3 ? 'bg-[#9EB89D]' :
                'bg-[#B8D4B8]'
              }`}
            />
          ))}
        </motion.div>
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
