import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserPlan } from '@/hooks/useUserPlan';

const priorityStyles = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-blue-100 text-blue-700',
};

const categoryIcons = {
  content: '✍️',
  engagement: '💬',
  networking: '🤝',
  seo_keywords: '🔍',
  posting_schedule: '📅',
};

const FREE_LIMIT = 3;

export default function RecommendationsList({ recommendations = [] }) {
  const { isPro } = useUserPlan();
  const visibleCount = isPro ? recommendations.length : FREE_LIMIT;
  const visible = recommendations.slice(0, visibleCount);
  const locked = recommendations.slice(visibleCount);

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold mb-4">Actionable Recommendations</h3>
      <div className="space-y-3">
        {visible.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="p-4 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>{categoryIcons[r.category] || '💡'}</span>
                {r.title}
              </h4>
              <Badge className={`${priorityStyles[r.priority] || priorityStyles.medium} text-[10px] flex-shrink-0`}>
                {r.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
          </motion.div>
        ))}
      </div>

      {!isPro && locked.length > 0 && (
        <div className="relative mt-3">
          <div className="space-y-3 blur-sm pointer-events-none opacity-40">
            {locked.slice(0, 3).map((r, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span>{categoryIcons[r.category] || '💡'}</span>
                    {r.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-3">+{locked.length} more recommendations</p>
            <Link to="/pricing">
              <Button size="sm" className="gap-1.5 rounded-lg text-xs">
                <Zap className="w-3 h-3" /> Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
