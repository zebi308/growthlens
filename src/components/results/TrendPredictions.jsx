import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Lightbulb, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserPlan } from '@/hooks/useUserPlan';

const platformColors = {
  Instagram: 'bg-pink-900/30 text-pink-400',
  TikTok: 'bg-purple-900/30 text-purple-400',
  YouTube: 'bg-red-900/30 text-red-400',
  'Twitter/X': 'bg-sky-900/30 text-sky-400',
  LinkedIn: 'bg-blue-900/30 text-blue-400',
};

const FREE_LIMIT = 1;

export default function TrendPredictions({ trends = [] }) {
  const { isPro } = useUserPlan();
  if (!trends.length) return null;

  const visibleCount = isPro ? trends.length : FREE_LIMIT;
  const visible = trends.slice(0, visibleCount);
  const locked = trends.slice(visibleCount);

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" /> 7-Day Trend Predictions
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Hot topics in your niche to post about this week</p>
      <div className="space-y-3">
        {visible.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className="text-sm font-semibold text-foreground">{t.topic}</h4>
              {t.platform && (
                <Badge className={`${platformColors[t.platform] || 'bg-muted text-muted-foreground'} text-[10px] flex-shrink-0`}>
                  {t.platform}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{t.why}</p>
            {t.content_idea && (
              <div className="flex items-start gap-1.5 text-xs text-primary">
                <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{t.content_idea}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {!isPro && locked.length > 0 && (
        <div className="relative mt-3">
          <div className="space-y-3 blur-sm pointer-events-none opacity-40">
            {locked.slice(0, 2).map((t, i) => (
              <div key={i} className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
                <h4 className="text-sm font-semibold text-foreground">{t.topic}</h4>
                <p className="text-xs text-muted-foreground">{t.why}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-3">+{locked.length} more trend predictions</p>
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
