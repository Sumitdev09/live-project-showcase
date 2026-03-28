import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Instagram, ArrowRight, Download } from 'lucide-react';

/* ── tiny floating dots, maroon + white only ── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      sx: (Math.random() - 0.5) * 0.3,
      sy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#8B1A1A' : '#ffffff',
      op: Math.random() * 0.5 + 0.15,
      t: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.t += 0.018;
        p.x += p.sx; p.y += p.sy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const opacity = p.op * (0.55 + 0.45 * Math.sin(p.t));
        ctx.fillStyle = p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function HeroSection({ profile }) {
  const socialLinks = [
    { icon: Github,    url: profile?.github,    label: 'GitHub'    },
    { icon: Linkedin,  url: profile?.linkedin,  label: 'LinkedIn'  },
    { icon: Twitter,   url: profile?.twitter,   label: 'Twitter'   },
    { icon: Instagram, url: profile?.instagram, label: 'Instagram' },
  ].filter(s => s.url);

  const firstName = profile?.full_name?.split(' ')[0] || 'Creative';
  const lastName  = profile?.full_name?.split(' ').slice(1).join(' ') || '';

  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0d0d0d]">

      {/* particles */}
      <Particles />

      {/* single soft maroon glow — centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(139,26,26,0.18) 0%, transparent 70%)',
        }}
      />



      {/* ── content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-10 py-24 flex flex-col items-center text-center">

        {/* greeting */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[#888] text-xs sm:text-sm tracking-[0.22em] uppercase mb-4 font-medium"
        >
          Hello, my name is
        </motion.p>

        {/* name */}
        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 70, damping: 14 }}
          className="font-black leading-none tracking-tight mb-5"
          style={{ fontSize: 'clamp(42px, 9vw, 100px)' }}
        >
          <span className="text-[#8B1A1A]">{firstName}</span>
          {lastName && <span className="text-white"> {lastName}</span>}
        </motion.h1>

        {/* title divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="flex items-center gap-4 mb-7"
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#8B1A1A]" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8c4c4] via-[#f0d6d6] to-[#e8c4c4] text-sm sm:text-base md:text-lg font-bold tracking-[0.22em] uppercase whitespace-nowrap drop-shadow-sm">
            {profile?.title || 'Full Stack Developer'}
          </span>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#8B1A1A]" />
        </motion.div>

        {/* bio */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[#777] text-sm sm:text-base md:text-lg max-w-lg lg:max-w-2xl leading-relaxed mb-10"
        >
          {profile?.bio?.substring(0, 155) || 'Crafting digital experiences that inspire, engage, and leave a lasting impression.'}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(139,26,26,0.55)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => profile?.resume_url && window.open(profile.resume_url, '_blank')}
            className="flex items-center justify-center gap-2 bg-[#8B1A1A] hover:bg-[#a52020] text-white px-8 py-3.5 rounded-full font-bold text-sm sm:text-base tracking-wide transition-all duration-300 shadow-lg shadow-[#8B1A1A]/30"
          >
            <Download className="w-4 h-4" />
            Download CV
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, borderColor: '#8B1A1A', color: '#fff' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center justify-center gap-2 border border-white/20 text-white/70 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:bg-white/5"
          >
            About Me
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* socials */}
        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 mb-14"
          >
            {socialLinks.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.07 }}
                whileHover={{ scale: 1.2, boxShadow: '0 0 18px rgba(139,26,26,0.5)', backgroundColor: '#8B1A1A' }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/12 flex items-center justify-center text-[#aaa] hover:text-white transition-all duration-300"
              >
                <s.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex flex-wrap justify-center gap-10 sm:gap-16 md:gap-24"
        >
          {[
            { value: '2+',   label: 'Years Experience' },
            { value: '20+',  label: 'Projects Done'    },
            { value: '100%', label: 'Satisfaction'     },
          ].map((stat, i) => (
            <motion.div key={stat.label} className="text-center" whileHover={{ scale: 1.06 }}>
              <motion.div
                className="text-3xl sm:text-4xl font-black text-[#8B1A1A] mb-1"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.95 + i * 0.08, type: 'spring', stiffness: 160 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[#555] text-xs sm:text-sm tracking-widest uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* bottom fade to black */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '160px' }}>
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0d0d0d 100%)',
        }} />
      </div>
    </section>
  );
}
