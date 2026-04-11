import React from 'react';
import { motion } from 'framer-motion';

const gradeConfig = {
  A: {
    text: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-emerald-500/5',
    glow: '0 0 24px rgba(52,211,153,0.5), 0 0 48px rgba(52,211,153,0.2)',
    border: 'rgba(52,211,153,0.4)',
  },
  B: {
    text: 'text-blue-400',
    bg: 'from-blue-500/20 to-blue-500/5',
    glow: '0 0 24px rgba(96,165,250,0.5), 0 0 48px rgba(96,165,250,0.2)',
    border: 'rgba(96,165,250,0.4)',
  },
  C: {
    text: 'text-amber-400',
    bg: 'from-amber-500/20 to-amber-500/5',
    glow: '0 0 24px rgba(251,191,36,0.4), 0 0 48px rgba(251,191,36,0.15)',
    border: 'rgba(251,191,36,0.35)',
  },
  D: {
    text: 'text-orange-400',
    bg: 'from-orange-500/20 to-orange-500/5',
    glow: '0 0 24px rgba(251,146,60,0.4), 0 0 48px rgba(251,146,60,0.15)',
    border: 'rgba(251,146,60,0.35)',
  },
  F: {
    text: 'text-red-400',
    bg: 'from-red-500/20 to-red-500/5',
    glow: '0 0 24px rgba(248,113,113,0.5), 0 0 48px rgba(248,113,113,0.2)',
    border: 'rgba(248,113,113,0.4)',
  },
};

export default function GradeCircle({ grade, label, size = 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-28 h-28 text-4xl' : 'w-16 h-16 text-xl';
  const labelClass = size === 'lg' ? 'text-sm mt-2' : 'text-xs mt-1';
  const cfg = gradeConfig[grade] || gradeConfig.C;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.08 }}
        className={`${sizeClasses} rounded-full bg-gradient-to-b ${cfg.bg} flex items-center justify-center font-black ${cfg.text} transition-all duration-300`}
        style={{
          boxShadow: cfg.glow,
          border: `1.5px solid ${cfg.border}`,
        }}
      >
        <motion.span
          animate={{ textShadow: [`0 0 10px currentColor`, `0 0 20px currentColor`, `0 0 10px currentColor`] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          {grade || '—'}
        </motion.span>
      </motion.div>
      {label && <p className={`${labelClass} text-muted-foreground font-medium text-center`}>{label}</p>}
    </div>
  );
}