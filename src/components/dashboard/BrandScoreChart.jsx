import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';

const gradeToNum = { A: 95, B: 78, C: 60, D: 42, F: 20 };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-primary/20 text-xs">
      <p className="text-foreground font-semibold">{payload[0]?.payload?.name}</p>
      <p className="text-primary font-bold">{payload[0]?.value}/100</p>
    </div>
  );
}

const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];

export default function BrandScoreChart({ analyses }) {
  const completed = [...analyses].filter(a => a.status === 'completed' && a.overall_grade);
  const latest = completed[completed.length - 1] || completed[0];

  // If we have a completed analysis, show radar breakdown
  if (latest) {
    const radarData = [
      { metric: 'Overall', value: gradeToNum[latest.overall_grade] || 50 },
      { metric: 'Content', value: gradeToNum[latest.content_quality_grade] || 50 },
      { metric: 'Engagement', value: gradeToNum[latest.engagement_grade] || 50 },
      { metric: 'Networking', value: gradeToNum[latest.networking_grade] || 50 },
      { metric: 'Industry Fit', value: gradeToNum[latest.alignment_grade] || 50 },
    ];

    const barData = radarData.map((d, i) => ({ ...d, name: d.metric }));

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 neon-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-foreground">Brand Performance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {latest.industry || 'Latest analysis'} — Grade {latest.overall_grade}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-primary">{latest.overall_grade}</p>
            <p className="text-[10px] text-muted-foreground">Overall</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(128,128,128,0.08)" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {completed.length > 1 && (
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            {completed.length} analyses completed — showing latest
          </p>
        )}
      </motion.div>
    );
  }

  // No analyses yet - show placeholder
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6 neon-border flex flex-col items-center justify-center"
      style={{ minHeight: 280 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-3xl font-black text-primary/30">?</span>
      </div>
      <h3 className="font-display font-bold text-foreground mb-1">Brand Performance</h3>
      <p className="text-xs text-muted-foreground text-center max-w-xs">
        Run your first analysis to see your brand performance breakdown across 5 key metrics
      </p>
    </motion.div>
  );
}
