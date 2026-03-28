import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ExternalLink, Github, Code2, Palette, TrendingUp, ArrowLeft, Sparkles, Grid3x3, Filter, Zap, Eye, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function AllProjects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const categories = [
    { name: 'All', icon: null },
    { name: 'Web Development', icon: Code2 },
    { name: 'Graphic Design', icon: Palette },
    { name: 'Digital Marketing', icon: TrendingUp },
  ];

  const getProjectLinks = (project) => {
    if (project.category === 'Web Development') {
      return [
        { href: project.github_url || null, icon: Github, label: 'GitHub' },
        { href: project.live_url || null, icon: ExternalLink, label: 'Live Preview' },
      ];
    }
    if (project.category === 'Graphic Design') {
      return [
        { href: project.live_url || null, icon: Eye, label: 'View Design' },
        { href: project.material_url || null, icon: Package, label: 'Materials' },
      ];
    }
    if (project.category === 'Digital Marketing') {
      return [
        { href: project.live_url || null, icon: Eye, label: 'View Campaign' },
        { href: project.material_url || null, icon: Package, label: 'Materials' },
      ];
    }
    return [
      { href: project.live_url || null, icon: ExternalLink, label: 'Live Preview' },
      { href: project.github_url || null, icon: Github, label: 'GitHub' },
    ];
  };

  const filteredProjects = activeCategory === 'All'
    ? projects.filter(p => !p.featured)
    : projects.filter(p => p.category === activeCategory && !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f9f7] via-white to-[#faf5f5] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-[#8B1A1A]/8 rounded-full blur-3xl"
          style={{ y: y1 }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 80, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-[#1a1a1a]/5 rounded-full blur-3xl"
          style={{ y: y2 }}
          animate={{
            scale: [1.3, 1, 1.3],
            x: [0, -50, 0],
            y: [0, -70, 0],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B1A1A]/5 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#e0e0e0]/50 sticky top-0 z-20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <Link
                to={createPageUrl('Home')}
                className="inline-flex items-center gap-2 text-[#666666] hover:text-[#8B1A1A] transition-all mb-4 md:mb-6 group"
              >
                <motion.div
                  whileHover={{ x: -6, scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowLeft className="w-4 h-4 group-hover:text-[#8B1A1A]" />
                </motion.div>
                <span className="text-sm md:text-base font-medium">Back to Home</span>
              </Link>
            </motion.div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] mb-3"
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.1
                  }}
                >
                  All <motion.span
                    className="text-[#8B1A1A]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Projects
                  </motion.span>
                </motion.h1>
                <motion.p
                  className="text-[#666666] text-base md:text-lg flex items-center gap-2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-4 h-4 text-[#8B1A1A]" />
                  </motion.div>
                  Explore my complete portfolio of work
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.5
                }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="flex items-center gap-2 text-sm text-[#666666] bg-gradient-to-r from-[#f9f0f0] to-[#f5e8e8] px-5 py-2.5 rounded-full shadow-md"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Grid3x3 className="w-4 h-4 text-[#8B1A1A]" />
                </motion.div>
                <span className="font-semibold">{filteredProjects.length} Project{filteredProjects.length !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter Section */}
      <motion.div
        className="bg-gradient-to-r from-white via-[#fafafa] to-white backdrop-blur-xl border-b border-[#e0e0e0]/50 sticky top-[88px] md:top-[112px] z-10 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7">
          {/* Header with Filter Icon */}
          <motion.div
            className="flex items-center justify-between mb-4 md:mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#8B1A1A] to-[#A52828] flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Filter className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-[#1a1a1a]">Filter Projects</h3>
                <p className="text-xs md:text-sm text-[#666666]">Choose your category</p>
              </div>
            </div>
           
            {/* Active Filter Count Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              className="hidden sm:flex items-center gap-2 bg-[#f9f0f0] px-4 py-2 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#8B1A1A]" />
              <span className="text-sm font-semibold text-[#1a1a1a]">{activeCategory}</span>
            </motion.div>
          </motion.div>

          {/* Filter Buttons Grid */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.name;
              const Icon = category.icon;
             
              return (
                <motion.button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.7 + (index * 0.08),
                    type: "spring",
                    stiffness: 180,
                    damping: 15
                  }}
                  whileHover={{
                  scale: 1.05,
                  y: -4,
                  boxShadow: "0 10px 30px rgba(139, 26, 26, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-3 md:px-6 md:py-4 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#8B1A1A] via-[#A52828] to-[#8B1A1A] text-white shadow-2xl shadow-[#8B1A1A]/50 border-2 border-white'
                      : 'bg-white text-[#666666] border-2 border-[#e0e0e0] hover:border-[#8B1A1A] hover:text-[#8B1A1A] shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Shimmer Effect for Active */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    </motion.div>
                  )}
                 
                  <div className="relative flex items-center justify-center gap-2 md:gap-2.5">
                    {Icon && (
                      <motion.div
                        animate={isActive ? {
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.div>
                    )}
                    <span className="whitespace-nowrap">{category.name}</span>
                   
                    {/* Active Indicator Dot */}
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8B1A1A] rounded-full shadow-lg"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile Active Category Display */}
          <motion.div
            className="sm:hidden mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#f9f0f0] px-4 py-2 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#8B1A1A]" />
              <span className="text-xs font-bold text-[#1a1a1a]">Active: {activeCategory}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] h-96 shadow-lg"
                >
                  <motion.div
                    className="h-full flex flex-col"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="h-48 bg-gradient-to-br from-[#f9f0f0] via-[#f5e8e8] to-[#f9f0f0] animate-pulse" />
                    <div className="p-6 flex-1 space-y-3">
                      <motion.div
                        className="h-4 bg-[#f9f0f0] rounded w-3/4"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="h-3 bg-[#f9f9f7] rounded w-full"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="h-3 bg-[#f9f9f7] rounded w-5/6"
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      />
                      <div className="flex gap-2 mt-4">
                        <motion.div
                          className="h-6 bg-[#f9f0f0] rounded-full w-16"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                        />
                        <motion.div
                          className="h-6 bg-[#f9f0f0] rounded-full w-20"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
        ) : filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className="text-center py-20 md:py-32"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#f9f0f0] to-[#f5e8e8] flex items-center justify-center shadow-lg"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Grid3x3 className="w-12 h-12 text-[#8B1A1A]" />
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-[#666666] text-base md:text-lg font-semibold"
              >
                No projects found in this category.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-[#999999] text-sm mt-2"
              >
                Try selecting a different filter
              </motion.p>
            </motion.div>
        ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 150,
                    damping: 20
                  }}
                  whileHover={{
                    y: -15,
                    rotateY: 5,
                    scale: 1.03,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className="group bg-white rounded-3xl overflow-hidden border-2 border-[#e0e0e0] hover:border-[#8B1A1A] transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-[#8B1A1A]/20"
                  style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                >
                  {/* Image with Overlay */}
                  <div className="relative aspect-video overflow-hidden bg-[#f5f0f0]">
                    {project.image_url && (
                      <motion.img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        animate={hoveredIndex === index ? {
                          scale: 1.15,
                          rotate: 2,
                          filter: "brightness(1.1)"
                        } : {
                          scale: 1,
                          rotate: 0,
                          filter: "brightness(1)"
                        }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                   
                    {/* Gradient Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"
                      initial={{ opacity: 0.3 }}
                      animate={hoveredIndex === index ? { opacity: 0.7 } : { opacity: 0.3 }}
                      transition={{ duration: 0.3 }}
                    />
                   
                    {/* Hover Overlay with Buttons */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={hoveredIndex === index ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="flex gap-3"
                        initial={{ y: 30, scale: 0.8 }}
                        animate={hoveredIndex === index ? { y: 0, scale: 1 } : { y: 30, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {getProjectLinks(project).map((link, li) => (
                          <motion.a
                            key={link.label}
                            whileHover={{ scale: 1.15, rotate: li === 0 ? 5 : -5 }}
                            whileTap={{ scale: 0.9 }}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={link.label}
                            className={li === 0
                              ? "bg-gradient-to-r from-white to-[#f9f0f0] text-[#1a1a1a] px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:from-[#8B1A1A] hover:to-[#A52828] hover:text-white transition-all shadow-2xl border-2 border-white/50"
                              : "bg-white/95 backdrop-blur-sm text-[#1a1a1a] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all shadow-2xl border-2 border-white/50"
                            }
                            onClick={(e) => e.stopPropagation()}
                          >
                            <link.icon className="w-4 h-4" />
                            {li === 0 && <span className="hidden sm:inline">{link.label}</span>}
                          </motion.a>
                        ))}
                      </motion.div>
                    </motion.div>

                    {/* Category Badge */}
                    {project.category && (
                      <motion.div
                        className="absolute top-3 left-3"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        <motion.span
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#1a1a1a] text-xs font-bold shadow-lg border-2 border-white/30"
                          whileHover={{ scale: 1.1, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {categories.find(c => c.name === project.category)?.icon &&
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              {React.createElement(categories.find(c => c.name === project.category).icon, { className: "w-3.5 h-3.5 text-[#8B1A1A]" })}
                            </motion.div>
                          }
                          {project.category}
                        </motion.span>
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    className="p-6 md:p-7 flex flex-col flex-1"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <motion.h3
                      className="text-lg md:text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#8B1A1A] transition-colors line-clamp-1"
                      animate={hoveredIndex === index ? { x: 5 } : { x: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {project.title}
                    </motion.h3>
                    <motion.p
                      className="text-[#666666] text-sm leading-relaxed mb-5 line-clamp-2 md:line-clamp-3"
                      animate={hoveredIndex === index ? { color: "#1a1a1a" } : { color: "#666666" }}
                    >
                      {project.description}
                    </motion.p>
                   
                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, x: -10, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{
                              delay: index * 0.1 + 0.4 + (i * 0.05),
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{
                              scale: 1.15,
                              y: -3,
                              backgroundColor: "#f9f0f0",
                              borderColor: "#8B1A1A"
                            }}
                            className="text-xs px-3 py-1.5 rounded-full bg-[#f9f9f7] border border-[#e0e0e0] text-[#666666] font-medium transition-all cursor-default shadow-sm"
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {project.technologies.length > 4 && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.6 }}
                            whileHover={{ scale: 1.15, y: -3 }}
                            className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f9f0f0] to-[#f5e8e8] text-[#8B1A1A] font-bold shadow-sm"
                          >
                            +{project.technologies.length - 4}
                          </motion.span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-[#f0f0f0] mt-auto">
                      {getProjectLinks(project).map((link, li) => (
                        link.href ? (
                          <motion.a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                              li === 0
                                ? 'bg-[#1a1a1a] text-white hover:bg-[#8B1A1A]'
                                : 'bg-[#f9f9f7] border border-[#e0e0e0] text-[#1a1a1a] hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
                            }`}
                          >
                            <link.icon className="w-3.5 h-3.5" />
                            {link.label}
                          </motion.a>
                        ) : (
                          <span
                            key={link.label}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#f0f0f0] text-[#aaa] cursor-not-allowed opacity-60"
                          >
                            <link.icon className="w-3.5 h-3.5" />
                            {link.label}
                          </span>
                        )
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}