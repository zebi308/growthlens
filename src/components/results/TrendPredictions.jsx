import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const platformColors = {
  Instagram: 'bg-pink-900/30 text-pink-400',
  TikTok: 'bg-purple-900/30 text-purple-400',
  YouTube: 'bg-red-900/30 text-red-400',
  'Twitter/X': 'bg-sky-900/30 text-sky-400',
  LinkedIn: 'bg-blue-900/30 text-blue-400',
};

export default function TrendPredictions({ trends = [] }) {
  if (!trends.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" /> 7-Day Trend Predictions
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Hot topics in your niche to post about this week</p>
      <div className="space-y-3">
        {trends.map((t, i) => (
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
    </Card>
  );
}