import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Download, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";

export default function CareerSection({ experiences, education, profile }) {
  const sortedExperiences = [...(experiences || [])].sort((a, b) => {
    if (a.is_current) return -1;
    if (b.is_current) return 1;
    return new Date(b.start_date) - new Date(a.start_date);
  });

  const sortedEducation = [...(education || [])].sort((a, b) => (b.end_year || 9999) - (a.end_year || 9999));

  const hasExperience = sortedExperiences.length > 0;
  const hasEducation = sortedEducation.length > 0;

  if (!hasExperience && !hasEducation) return null;

  return (
    <section id="experience" className="py-32 bg-[#f9f9f7] relative overflow-hidden">
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#8B1A1A]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#8B1A1A]/5 rounded-full blur-3xl" />
     
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-caveat text-2xl text-[#8B1A1A] mb-4 block">My Journey</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a]">
            My Professional <span className="text-[#8B1A1A]">Journey</span>
          </h2>
          <div className="w-16 h-1 bg-[#8B1A1A] mx-auto mt-4 mb-6" />
          <p className="text-[#666666] max-w-2xl mx-auto mb-8">A timeline of my education and work experience</p>
         
          {profile?.resume_url && (
            <Button
              asChild
              className="bg-[#8B1A1A] hover:bg-[#6E1515] text-white rounded-full px-8"
            >
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" />
                Download Full Resume
              </a>
            </Button>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#8B1A1A] flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">Work Experience</h3>
            </div>

            {sortedExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#8B1A1A] rounded-full" />
                {index < sortedExperiences.length - 1 && (
                  <div className="absolute left-1.5 top-5 bottom-0 w-px bg-[#e0e0e0]" />
                )}
               
                <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 hover:border-[#8B1A1A] hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-sm text-[#666666] mb-3">
                    <Calendar className="w-4 h-4" />
                    {exp.start_date && format(new Date(exp.start_date), 'yyyy')} - {exp.is_current ? 'Present' : exp.end_date && format(new Date(exp.end_date), 'yyyy')}
                  </div>
                 
                  <h4 className="text-lg font-semibold text-[#1a1a1a] mb-2">{exp.position}</h4>
                  {exp.is_current && (
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-[#8B1A1A]/10 text-[#8B1A1A] rounded-full mb-2">
                      Current Role
                    </span>
                  )}
                  <p className="text-[#8B1A1A] font-medium mb-3">{exp.company}</p>
                 
                  {exp.description && (
                    <p className="text-[#666666] text-sm leading-relaxed mb-3">{exp.description}</p>
                  )}
                 
                  {exp.location && (
                    <div className="flex items-center gap-1 text-xs text-[#666666]">
                      <MapPin className="w-3 h-3" />
                      {exp.location}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1a1a1a]">Education</h3>
            </div>

            {sortedEducation.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative pl-8"
              >
                <div className="absolute left-0 top-2 w-3 h-3 bg-[#1a1a1a] rounded-full" />
                {index < sortedEducation.length - 1 && (
                  <div className="absolute left-1.5 top-5 bottom-0 w-px bg-[#e0e0e0]" />
                )}
               
                <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 hover:border-[#8B1A1A] hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-sm text-[#666666] mb-3">
                    <Calendar className="w-4 h-4" />
                    {edu.start_year} - {edu.end_year || 'Present'}
                  </div>
                 
                  <h4 className="text-lg font-semibold text-[#1a1a1a] mb-2">{edu.degree}</h4>
                  {edu.field && (
                    <p className="text-[#8B1A1A] font-medium mb-3">{edu.field}</p>
                  )}
                  <p className="text-[#666666] text-sm mb-3">{edu.institution}</p>
                 
                  {edu.description && (
                    <p className="text-[#666666] text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
