import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lightbulb, TrendingUp, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const gradeColor = {
  A: 'text-green-400',
  B: 'text-emerald-400',
  C: 'text-amber-400',
  D: 'text-orange-400',
  F: 'text-red-400',
};

const gradeLabel = {
  A: 'Excellent',
  B: 'Good',
  C: 'Needs Work',
  D: 'Weak',
  F: 'Critical',
};

export default function BrandHealthTips({ analyses }) {
  const latest = analyses.find(a => a.status === 'completed');

  if (!latest) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 neon-border text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6 text-primary/50" />
        </div>
        <h3 className="font-display font-bold text-foreground mb-1">Brand Insights</h3>
        <p className="text-xs text-muted-foreground mb-4">Run your first analysis to see personalized tips here</p>
        <Link to="/dashboard/new-analysis">
          <Button size="sm" className="gap-1.5 rounded-lg text-xs">
            <Sparkles className="w-3 h-3" /> Start Analysis
          </Button>
        </Link>
      </motion.div>
    );
  }

  const grades = [
    { label: 'Overall', grade: latest.overall_grade },
    { label: 'Content', grade: latest.content_quality_grade },
    { label: 'Engagement', grade: latest.engagement_grade },
    { label: 'Networking', grade: latest.networking_grade },
    { label: 'Industry Fit', grade: latest.alignment_grade },
  ].filter(g => g.grade);

  const weakest = grades.slice(1).sort((a, b) => {
    const order = { F: 0, D: 1, C: 2, B: 3, A: 4 };
    return (order[a.grade] || 0) - (order[b.grade] || 0);
  })[0];

  const strongest = grades.slice(1).sort((a, b) => {
    const order = { A: 0, B: 1, C: 2, D: 3, F: 4 };
    return (order[a.grade] || 0) - (order[b.grade] || 0);
  })[0];

  const topRecs = (latest.recommendations || []).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-foreground">Brand Insights</h3>
          <p className="text-xs text-muted-foreground">From your latest analysis</p>
        </div>
        <Link to={`/dashboard/results?id=${latest.id}`} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
          View full report <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {strongest && (
          <div className="rounded-xl bg-green-500/5 border border-green-500/10 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-semibold uppercase">Strongest</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{strongest.label}</p>
            <p className={`text-lg font-black ${gradeColor[strongest.grade]}`}>
              {strongest.grade} <span className="text-xs font-normal text-muted-foreground">· {gradeLabel[strongest.grade]}</span>
            </p>
          </div>
        )}
        {weakest && (
          <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-amber-400 font-semibold uppercase">Needs Work</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{weakest.label}</p>
            <p className={`text-lg font-black ${gradeColor[weakest.grade]}`}>
              {weakest.grade} <span className="text-xs font-normal text-muted-foreground">· {gradeLabel[weakest.grade]}</span>
            </p>
          </div>
        )}
      </div>

      {topRecs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-primary" /> Top priorities
          </p>
          {topRecs.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                {i + 1}
              </span>
              <div>
                <span className="text-foreground font-medium">{r.title}</span>
                {r.description && <span className="text-muted-foreground"> — {r.description.slice(0, 80)}{r.description.length > 80 ? '…' : ''}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
