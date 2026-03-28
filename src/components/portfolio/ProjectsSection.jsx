import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Star, Code2, Palette, TrendingUp, Eye, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null;

  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  const categories = [
    { name: 'Web Development', icon: Code2 },
    { name: 'Graphic Design', icon: Palette },
    { name: 'Digital Marketing', icon: TrendingUp },
  ];

  const categorizedProjects = categories.map(cat => ({
    ...cat,
    projects: otherProjects.filter(p => p.category === cat.name).slice(0, 1)
  })).filter(cat => cat.projects.length > 0);

  // Returns the correct action links per category
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

  return (
    <section id="projects" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-20 right-20 w-40 h-40 border border-dashed border-[#e0e0e0] rounded-full opacity-50" />
      <div className="absolute bottom-40 left-20 w-32 h-32 border border-dashed border-[#e0e0e0] rounded-full opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-caveat text-2xl text-[#8B1A1A]">My Work</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a]">
            Featured <span className="text-[#8B1A1A]">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-[#8B1A1A] mx-auto mt-4" />
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="space-y-20 mb-20">
            {featuredProjects.map((project, index) => {
              const links = getProjectLinks(project);
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <motion.div whileHover={{ scale: 1.02 }} className="relative group">
                      <div className="absolute -inset-4 border-2 border-[#8B1A1A] rounded-lg opacity-30" />
                      <div className="relative">
                        <img
                          src={project.image_url || 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80'}
                          alt={project.title}
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-lg">
                          {links.map(link => (
                            <motion.a
                              key={link.label}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={link.title}
                              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#1a1a1a] hover:bg-[#8B1A1A] hover:text-white transition-colors"
                            >
                              <link.icon className="w-5 h-5" />
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <span className="inline-flex items-center gap-2 text-[#8B1A1A] font-medium text-sm mb-4">
                      <Star className="w-4 h-4 text-[#8B1A1A]" />
                      Featured Project
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-4">{project.title}</h3>
                    <p className="text-[#666666] leading-relaxed mb-6">{project.description}</p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-4 py-2 bg-[#f9f9f7] border border-[#e0e0e0] rounded-full text-sm text-[#666666]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {links.map(link => (
                        <Button
                          key={link.label}
                          asChild
                          className={link.label === links[0]?.label
                            ? 'bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full font-medium'
                            : 'rounded-full border-[#1a1a1a] text-[#1a1a1a] font-medium bg-white hover:bg-[#f9f0f0] border'
                          }
                        >
                          <a href={link.href} target="_blank" rel="noopener noreferrer">
                            <link.icon className="w-4 h-4 mr-2" />
                            {link.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Categorized Projects */}
        {categorizedProjects.length > 0 && (
          <>
            <h3 className="text-2xl font-semibold text-[#1a1a1a] text-center mb-12">
              Other <span className="text-[#8B1A1A]">Projects</span>
            </h3>
            <div className="grid lg:grid-cols-3 gap-8">
              {categorizedProjects.map((category, catIndex) => (
                <div key={category.name} className="flex flex-col">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e0e0e0]">
                    <div className="w-10 h-10 rounded-full bg-[#f9f0f0] flex items-center justify-center text-[#8B1A1A]">
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-xl font-semibold text-[#1a1a1a]">{category.name}</h4>
                  </div>

                  <div className="flex-1">
                    {category.projects.map((project, index) => {
                      const links = getProjectLinks(project);
                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: catIndex * 0.1 + index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                          className="group bg-white rounded-lg overflow-hidden border border-[#e0e0e0] hover:border-[#8B1A1A] transition-all duration-300 h-full flex flex-col"
                        >
                          {project.image_url && (
                            <div className="aspect-video overflow-hidden relative">
                              <div className="absolute top-3 right-3 z-10">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-[#1a1a1a] shadow-sm">
                                  {category.name}
                                </span>
                              </div>
                              <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 group-hover:text-[#8B1A1A] transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-[#666666] text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>

                            {project.technologies && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.slice(0, 3).map(tech => (
                                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-[#f9f9f7] border border-[#e0e0e0] text-[#666666]">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4 border-t border-[#f0f0f0]">
                              {links.map((link, li) => (
                                link.href ? (
                                  <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                      li === 0
                                        ? 'bg-[#1a1a1a] text-white hover:bg-[#8B1A1A]'
                                        : 'bg-[#f9f9f7] border border-[#e0e0e0] text-[#1a1a1a] hover:border-[#8B1A1A] hover:text-[#8B1A1A]'
                                    }`}
                                  >
                                    <link.icon className="w-3.5 h-3.5" />
                                    {link.label}
                                  </a>
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
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button asChild className="bg-[#1a1a1a] hover:bg-[#333] text-white rounded-full px-8 py-6 font-medium">
                <Link to={createPageUrl('AllProjects')}>
                  View All Projects <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
