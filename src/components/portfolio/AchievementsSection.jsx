import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target, Zap } from 'lucide-react';

export default function AchievementsSection({ achievements }) {
  if (!achievements || achievements.length === 0) return null;

  const icons = [Trophy, Star, Award, Target, Zap];

  return (
    <section id="achievements" className="py-32 bg-[#0a0a0f] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-rose-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400">Milestones</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Achievements & <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Awards</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                  {achievement.year && (
                    <span className="text-xs text-amber-500/60 font-medium">{achievement.year}</span>
                  )}
                  <h3 className="text-xl font-bold text-white mt-1 mb-3">{achievement.title}</h3>
                  <p className="text-slate-400">{achievement.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}