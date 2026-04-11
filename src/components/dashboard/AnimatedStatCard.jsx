import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (typeof target !== 'number') return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

function RadialRing({ pct, color, size = 80 }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    setTimeout(() => setDash((pct / 100) * circ), 100);
  }, [pct, circ]);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - dash}
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
}

const sparkData = Array.from({ length: 8 }, (_, i) => ({ v: Math.floor(Math.random() * 60) + 20 + i * 5 }));

export default function AnimatedStatCard({ icon: IconComponent, label, value, color, accentColor, radialPct, ringColor, type = 'number', delay = 0 }) {
  const Icon = IconComponent;
  const counted = useCountUp(type === 'number' ? (Number(value) || 0) : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="glass-card rounded-2xl p-5 neon-border flex flex-col gap-3 cursor-default relative overflow-hidden"
    >
      {/* background glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10" style={{ background: accentColor, filter: 'blur(20px)' }} />

      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {radialPct !== undefined ? (
          <div className="relative flex items-center justify-center w-14 h-14">
            <RadialRing pct={radialPct} color={ringColor || '#a855f7'} size={56} />
            <span className="absolute text-[10px] font-bold text-foreground">{value}</span>
          </div>
        ) : (
          <div className="h-10 w-20 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={accentColor} strokeWidth={1.5} fill={`url(#sg-${label})`} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-black text-foreground">
          {type === 'number' ? counted : value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}