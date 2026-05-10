import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

const EMOJIS = [
  { key: 'clap', char: '👏', label: 'Clap' },
  { key: 'heart', char: '❤️', label: 'Love' },
  { key: 'fire', char: '🔥', label: 'Fire' },
  { key: 'rocket', char: '🚀', label: 'Rocket' },
  { key: 'wow', char: '🤩', label: 'Wow' },
];

function getVisitorId() {
  try {
    let id = localStorage.getItem('visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('visitor_id', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

export default function Reactions({ targetType, targetId, variant = 'light', size = 'md' }) {
  const [counts, setCounts] = useState({});
  const [mine, setMine] = useState(new Set());
  const [bursting, setBursting] = useState(null);
  const visitorId = getVisitorId();

  const load = useCallback(async () => {
    if (!targetId) return;
    const { data } = await supabase
      .from('reactions')
      .select('emoji, visitor_id')
      .eq('target_type', targetType)
      .eq('target_id', targetId);
    if (!data) return;
    const c = {};
    const m = new Set();
    for (const r of data) {
      c[r.emoji] = (c[r.emoji] || 0) + 1;
      if (r.visitor_id === visitorId) m.add(r.emoji);
    }
    setCounts(c);
    setMine(m);
  }, [targetType, targetId, visitorId]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (emoji) => {
    const has = mine.has(emoji);
    // optimistic
    const newMine = new Set(mine);
    const newCounts = { ...counts };
    if (has) {
      newMine.delete(emoji);
      newCounts[emoji] = Math.max(0, (newCounts[emoji] || 0) - 1);
    } else {
      newMine.add(emoji);
      newCounts[emoji] = (newCounts[emoji] || 0) + 1;
      setBursting(emoji);
      setTimeout(() => setBursting(null), 700);
    }
    setMine(newMine);
    setCounts(newCounts);

    if (has) {
      await supabase
        .from('reactions')
        .delete()
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .eq('emoji', emoji)
        .eq('visitor_id', visitorId);
    } else {
      await supabase
        .from('reactions')
        .insert({ target_type: targetType, target_id: targetId, emoji, visitor_id: visitorId });
    }
  };

  const isDark = variant === 'dark';
  const btnSize = size === 'sm' ? 'h-8 px-2.5 text-xs gap-1' : 'h-10 px-3 text-sm gap-1.5';
  const iconSize = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
      {EMOJIS.map((e) => {
        const active = mine.has(e.key);
        const count = counts[e.key] || 0;
        return (
          <motion.button
            key={e.key}
            type="button"
            onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); toggle(e.key); }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -2 }}
            title={e.label}
            className={`relative inline-flex items-center rounded-full border transition-all font-medium ${btnSize} ${
              active
                ? 'bg-[#8B1A1A] border-[#8B1A1A] text-white shadow-md shadow-[#8B1A1A]/30'
                : isDark
                  ? 'bg-white/10 border-white/15 hover:border-white/40 text-white'
                  : 'bg-white border-[#e0e0e0] hover:border-[#8B1A1A] text-[#1a1a1a]'
            }`}
          >
            <span className={iconSize}>{e.char}</span>
            <span className="tabular-nums">{count}</span>
            <AnimatePresence>
              {bursting === e.key && (
                <motion.span
                  initial={{ opacity: 1, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -28, scale: 1.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none text-xl"
                >
                  {e.char}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
