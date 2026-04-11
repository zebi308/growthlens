import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const gradeToNum = { A: 95, B: 78, C: 60, D: 42, F: 20 };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-primary/20 text-xs">
      <p className="text-muted-foreground mb-0.5">{label}</p>
      <p className="text-primary font-bold">{payload[0]?.value} pts</p>
    </div>
  );
}

export default function BrandScoreChart({ analyses }) {
  const completed = [...analyses].filter(a => a.status === 'completed' && a.overall_grade).reverse();

  const data = completed.length > 0
    ? completed.map((a, i) => ({
        week: `W${i + 1}`,
        score: gradeToNum[a.overall_grade] || 50,
        label: a.industry || `Analysis ${i + 1}`,
      }))
    : Array.from({ length: 6 }, (_, i) => ({ week: `W${i + 1}`, score: 30 + i * 10, label: `Week ${i + 1}` }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-foreground">Brand Score Over Time</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weekly brand performance trend</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary" /> Score
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={2.5}
            fill="url(#scoreGrad)" dot={{ fill: '#a855f7', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#a855f7', stroke: 'rgba(168,85,247,0.4)', strokeWidth: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}