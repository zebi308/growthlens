import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b', '#6366f1'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="font-semibold text-foreground">{payload[0].payload.goal}</p>
      <p className="text-primary">{payload[0].value}%</p>
    </div>
  );
}

export default function GoalProgressChart({ analyses }) {
  const goalCounts = {};
  const goalTotal = {};
  analyses.forEach(a => {
    a.goals?.forEach(g => {
      goalTotal[g] = (goalTotal[g] || 0) + 1;
      if (a.status === 'completed') goalCounts[g] = (goalCounts[g] || 0) + 1;
    });
  });

  const fallbackData = [
    { goal: 'Grow Audience', pct: 72 },
    { goal: 'Build Authority', pct: 58 },
    { goal: 'Land Brand Deals', pct: 45 },
    { goal: 'Monetize Content', pct: 33 },
  ];

  const data = Object.keys(goalTotal).length > 0
    ? Object.entries(goalTotal).map(([g, total]) => ({
        goal: g.length > 18 ? g.slice(0, 18) + '…' : g,
        pct: Math.round(((goalCounts[g] || 0) / total) * 100),
      }))
    : fallbackData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="font-display font-bold text-foreground mb-1">Goal Progress</h3>
      <p className="text-xs text-muted-foreground mb-4">Completion rate per goal</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="goal" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={16}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}