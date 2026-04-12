import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import GradeCircle from './GradeCircle';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';

const statusConfig = {
  pending:   { border: 'border-amber-500/60',  bg: 'bg-amber-500/10',  text: 'text-amber-400',   label: 'Pending' },
  analyzing: { border: 'border-blue-500/60',   bg: 'bg-blue-500/10',   text: 'text-blue-400',    label: 'Analyzing' },
  completed: { border: 'border-emerald-500/60', bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Completed' },
  failed:    { border: 'border-red-500/60',    bg: 'bg-red-500/10',    text: 'text-red-400',     label: 'Failed' },
};

const gradeToScore = { A: 92, B: 76, C: 58, D: 40, F: 18 };

export default function KanbanAnalysisCard({ analysis }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[analysis.status] || statusConfig.pending;

  const barData = [
    { name: 'Content', v: gradeToScore[analysis.content_quality_grade] || 50 },
    { name: 'Engage', v: gradeToScore[analysis.engagement_grade] || 50 },
    { name: 'Network', v: gradeToScore[analysis.networking_grade] || 50 },
    { name: 'Align', v: gradeToScore[analysis.alignment_grade] || 50 },
  ];

  const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl border-l-4 ${cfg.border} overflow-hidden group`}
    >
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                {cfg.label}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(analysis.created_date), 'MMM d, yyyy')}
              </span>
            </div>
            <h3 className="font-bold text-foreground truncate text-sm">{analysis.industry || 'Untitled Analysis'}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {analysis.goals?.slice(0, 2).join(' · ') || 'No goals set'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {analysis.status === 'completed' && analysis.overall_grade && (
              <GradeCircle grade={analysis.overall_grade} size="sm" />
            )}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {analysis.status === 'completed' && (
          <div className="mt-3 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Bar dataKey="v" radius={[3, 3, 0, 0]} maxBarSize={20}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              {analysis.brand_summary && (
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{analysis.brand_summary}</p>
              )}
              <Link
                to={`/dashboard/results?id=${analysis.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                View Full Report <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
