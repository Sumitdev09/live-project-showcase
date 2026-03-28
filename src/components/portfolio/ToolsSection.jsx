import React from 'react';
import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';

export default function ToolsSection({ tools }) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0f] relative overflow-hidden border-t border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
            <Wrench className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">My Toolkit</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Tools & Technologies I Use
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-300 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300 cursor-default"
            >
              {tool}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

