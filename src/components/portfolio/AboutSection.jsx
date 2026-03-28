import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Heart, Zap, Coffee, Users, Award } from 'lucide-react';

export default function AboutSection({ profile }) {
  const stats = [
    { value: '10+', label: 'Projects Completed' },
    { value: '15+', label: 'Happy Clients' },
    { value: '3+', label: 'Years Learning' },
    { value: '∞', label: 'Cups of Coffee' },
  ];

  const traits = [
    {
      title: 'Fresh Graduate',
      description: 'Recently graduated with a passion for digital innovation and creativity',
      icon: GraduationCap
    },
    {
      title: 'Goal-Oriented',
      description: 'Focused on delivering results that exceed expectations every time',
      icon: Target
    },
    {
      title: 'Passionate',
      description: 'Love turning creative ideas into beautiful digital reality',
      icon: Heart
    },
    {
      title: 'Fast Learner',
      description: 'Quick to adapt and master new technologies and methodologies',
      icon: Zap
    },
  ];

  return (
    <section id="about" className="py-32 bg-[#f9f9f7] relative overflow-hidden" style={{ marginTop: 0 }}>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#8B1A1A]/5 rounded-full blur-3xl" />
     
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-caveat text-2xl text-[#8B1A1A] mb-4 block">About Me</span>
          <h2 className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-6">
            Get to Know <span className="text-[#8B1A1A]">Me Better</span>
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            A passionate creator at the intersection of design and technology
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-[#8B1A1A] to-[#A52828] rounded-full blur-md opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-[#8B1A1A] overflow-hidden bg-white"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={profile?.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80'}
                  alt={profile?.full_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 bg-white border-2 border-[#8B1A1A] rounded-2xl flex items-center justify-center rotate-12 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Coffee className="w-8 h-8 text-[#8B1A1A]" />
              </motion.div>
              <motion.div
                className="absolute -bottom-6 -left-6 w-16 h-16 bg-white border-2 border-[#1a1a1a] rounded-2xl flex items-center justify-center -rotate-12 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="w-8 h-8 text-[#1a1a1a]" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-semibold text-[#1a1a1a] mb-6">
                Hello! I'm a Creative Professional
              </h3>
              <div className="space-y-4 text-[#666666] leading-relaxed">
                <p>
                  I'm a fresh graduate with a unique blend of skills in web development, digital marketing, and graphic design. My journey started with a curiosity for how technology can transform ideas into impactful experiences.
                </p>
                <p>
                  I believe in the power of combining technical expertise with creative thinking. Whether it's building responsive websites, crafting marketing strategies, or designing visual content, I approach every project with dedication and attention to detail.
                </p>
                <p>
                  When I'm not working on projects, you can find me exploring new design trends, learning emerging technologies, or contributing to creative communities online.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className="bg-white border border-[#e0e0e0] rounded-xl p-4 text-center hover:border-[#8B1A1A] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-3xl font-bold text-[#8B1A1A] mb-2">{stat.value}</div>
                  <div className="text-xs text-[#666666]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {traits.map((trait, index) => (
            <motion.div
              key={trait.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white border border-[#e0e0e0] rounded-2xl p-8 text-center hover:border-[#8B1A1A] hover:shadow-lg transition-all group cursor-pointer"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-6 bg-[#8B1A1A]/10 border border-[#8B1A1A]/20 rounded-2xl flex items-center justify-center group-hover:bg-[#8B1A1A] transition-colors"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <trait.icon className="w-8 h-8 text-[#8B1A1A] group-hover:text-white transition-colors" />
              </motion.div>
              <h4 className="text-lg font-semibold text-[#1a1a1a] mb-3">{trait.title}</h4>
              <p className="text-sm text-[#666666] leading-relaxed">{trait.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
