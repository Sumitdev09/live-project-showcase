import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Code, Palette, TrendingUp, Star, Zap, Heart, Lightbulb, Smartphone, BarChart3, Settings
} from 'lucide-react';

const ICON_MAP = {
  'code': Code,
  'palette': Palette,
  'trending-up': TrendingUp,
  'zap': Zap,
  'star': Star,
  'heart': Heart,
  'lightbulb': Lightbulb,
  'bar-chart': BarChart3,
  'settings': Settings,
  'smartphone': Smartphone,
};

const DEFAULT_CATEGORIES = [
  {
    title: 'Web Development', icon: Code, color: '#8B1A1A', bgColor: '#f9f0f0',
    skills: [
      { name: 'HTML & CSS', level: 95, icon: Zap },
      { name: 'JavaScript', level: 90, icon: Zap },
      { name: 'React', level: 88, icon: Zap },
      { name: 'Responsive Design', level: 92, icon: Zap },
      { name: 'UI/UX Implementation', level: 85, icon: Zap },
    ]
  },
  {
    title: 'Graphic Design', icon: Palette, color: '#8B1A1A', bgColor: '#f9f0f0',
    skills: [
      { name: 'Adobe Photoshop', level: 93, icon: Zap },
      { name: 'Adobe Illustrator', level: 90, icon: Zap },
      { name: 'Brand Identity', level: 87, icon: Zap },
      { name: 'Logo Design', level: 92, icon: Zap },
      { name: 'Print Design', level: 85, icon: Zap },
    ]
  },
  {
    title: 'Digital Marketing', icon: TrendingUp, color: '#8B1A1A', bgColor: '#f9f0f0',
    skills: [
      { name: 'Social Media Strategy', level: 90, icon: Zap },
      { name: 'Content Marketing', level: 88, icon: Zap },
      { name: 'SEO Optimization', level: 85, icon: Zap },
      { name: 'Email Campaigns', level: 82, icon: Zap },
      { name: 'Analytics & Insights', level: 87, icon: Zap },
    ]
  },
];

const DEFAULT_STATS = [
  { icon: Zap, label: 'Fast Delivery', value: '100%' },
  { icon: Heart, label: 'Client Satisfaction', value: '100%' },
  { icon: Lightbulb, label: 'Creative Solutions', value: '100%' },
  { icon: Star, label: 'Quality Work', value: '100%' },
];

export default function SkillsSection() {
  const { data: dbCategories = [] } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: () => base44.entities.SkillCategory.list('order'),
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['profile'],
    queryFn: () => base44.entities.Profile.list(),
  });

  const profile = profiles[0];

  const skillCategories = dbCategories.length > 0
    ? dbCategories.map(cat => ({
        ...cat,
        icon: ICON_MAP[cat.icon_name] || Star,
        color: '#8B1A1A',
        bgColor: '#f9f0f0',
        skills: (cat.skills || []).map(s => ({ ...s, icon: Zap })),
      }))
    : DEFAULT_CATEGORIES;

  const stats = (profile?.skill_stats && profile.skill_stats.length > 0)
    ? profile.skill_stats.map(s => ({
        icon: ICON_MAP[s.icon_name] || Star,
        label: s.label,
        value: s.value,
      }))
    : DEFAULT_STATS;

  return (
    <section id="skills" className="py-32 bg-[#f9f9f7] relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-96 h-96 bg-[#8B1A1A]/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#8B1A1A]/8 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="font-caveat text-2xl text-[#8B1A1A] mb-4 block">What I Do Best</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
            My <span className="text-[#8B1A1A]">Skills</span> & Expertise
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            A perfect blend of creativity, strategy, and technical expertise
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-[#1a1a1a]/10 hover:border-[#8B1A1A]/30 hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, ${category.color} 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>

                  <div className="relative mb-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 relative"
                      style={{ backgroundColor: category.bgColor }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-2xl opacity-20"
                        style={{ background: `conic-gradient(from 0deg, transparent, ${category.color}, transparent)` }}
                      />
                      <category.icon className="w-10 h-10 text-[#8B1A1A] relative z-10" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-[#1a1a1a] font-jost mb-2">{category.title}</h3>
                    <motion.div
                      className="w-16 h-1 bg-[#8B1A1A] rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      viewport={{ once: true }}
                      transition={{ delay: categoryIndex * 0.2 + 0.3 }}
                    />
                  </div>

                  <div className="space-y-4 relative">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: categoryIndex * 0.2 + skillIndex * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 5 }}
                        className="group/skill"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} transition={{ duration: 0.3 }}>
                              <skill.icon className="w-4 h-4 text-[#8B1A1A]" />
                            </motion.div>
                            <span className="text-[#1a1a1a] font-medium text-sm font-jost">{skill.name}</span>
                          </div>
                          <motion.span
                            className="text-[#666666] text-sm font-bold font-jost"
                            whileHover={{ scale: 1.2, color: '#1a1a1a' }}
                          >
                            {skill.level}%
                          </motion.span>
                        </div>

                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{
                              delay: categoryIndex * 0.2 + skillIndex * 0.05 + 0.2,
                              duration: 1.2,
                              ease: "easeOut"
                            }}
                            viewport={{ once: true }}
                            className="h-full bg-gradient-to-r from-[#8B1A1A] to-[#A52828] rounded-full relative overflow-hidden"
                          >
                            <motion.div
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                              className="absolute inset-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                    style={{ background: `linear-gradient(135deg, ${category.bgColor}, transparent)` }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-md border border-[#1a1a1a]/10 cursor-pointer"
            >
              <stat.icon className="w-8 h-8 text-[#8B1A1A] mx-auto mb-3" />
              <div className="text-2xl font-bold text-[#1a1a1a] mb-1 font-jost">{stat.value}</div>
              <div className="text-xs text-[#666666] font-jost">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}