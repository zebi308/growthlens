import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Lock, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useUserPlan } from '@/hooks/useUserPlan';

const gradeToNum = { A: 95, B: 78, C: 60, D: 42, F: 20 };
const gradeLabel = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Below Average', F: 'Needs Work' };
const gradeColor = { A: '#10b981', B: '#10b981', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-primary/20 text-xs">
      <p className="text-foreground font-semibold">{payload[0]?.payload?.name}</p>
      <p className="text-primary font-bold">{payload[0]?.value}/100</p>
    </div>
  );
}

export default function BrandScoreChart({ analyses }) {
  const { isPro } = useUserPlan();
  const completed = [...analyses].filter(a => a.status === 'completed' && a.overall_grade);
  const latest = completed[completed.length - 1] || completed[0];

  // No analyses yet
  if (!latest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 neon-border flex flex-col items-center justify-center"
        style={{ minHeight: 280 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary/30" />
        </div>
        <h3 className="font-display font-bold text-foreground mb-1">Brand Performance</h3>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Run your first analysis to see your brand performance breakdown
        </p>
      </motion.div>
    );
  }

  const overallScore = gradeToNum[latest.overall_grade] || 50;
  const overallGrade = latest.overall_grade;

  // Pro users: full bar chart
  if (isPro) {
    const barData = [
      { name: 'Overall', value: gradeToNum[latest.overall_grade] || 50 },
      { name: 'Content', value: gradeToNum[latest.content_quality_grade] || 50 },
      { name: 'Engagement', value: gradeToNum[latest.engagement_grade] || 50 },
      { name: 'Networking', value: gradeToNum[latest.networking_grade] || 50 },
      { name: 'Industry Fit', value: gradeToNum[latest.alignment_grade] || 50 },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 neon-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-foreground">Brand Performance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{latest.industry || 'Latest analysis'} — Grade {overallGrade}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black" style={{ color: gradeColor[overallGrade] || '#a855f7' }}>{overallGrade}</p>
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
      </motion.div>
    );
  }

  // Free users: prominent overall grade + blurred preview of sub-scores
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-foreground">Brand Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{latest.industry || 'Latest analysis'}</p>
        </div>
      </div>

      {/* Big overall grade display */}
      <div className="flex items-center justify-center mb-6">
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: `${gradeColor[overallGrade]}15`, border: `2px solid ${gradeColor[overallGrade]}40` }}
          >
            <span className="text-5xl font-black" style={{ color: gradeColor[overallGrade] }}>{overallGrade}</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{gradeLabel[overallGrade] || 'Average'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Overall Brand Score — {overallScore}/100</p>
        </div>
      </div>

      {/* Blurred sub-scores preview */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-3 blur-sm pointer-events-none opacity-40">
          {['Content', 'Engagement', 'Networking', 'Industry Fit'].map((label, i) => (
            <div key={label} className="text-center">
              <div className="w-full h-16 rounded-lg mb-1" style={{ background: `${COLORS[i + 1]}20` }}>
                <div className="h-full flex items-end justify-center pb-1">
                  <div className="w-8 rounded-t" style={{ height: `${40 + i * 8}%`, background: COLORS[i + 1] }} />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Lock className="w-4 h-4 text-muted-foreground mb-1.5" />
          <p className="text-xs text-muted-foreground mb-2">Detailed scores available in Pro</p>
          <Link to="/dashboard/pricing">
            <Button size="sm" className="gap-1.5 rounded-lg text-xs h-7 px-3">
              <Zap className="w-3 h-3" /> Upgrade
            </Button>
          </Link>
        </div>
      </div>

      {completed.length > 1 && (
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          {completed.length} analyses completed
        </p>
      )}
    </motion.div>
  );
}
