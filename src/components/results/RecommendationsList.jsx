import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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

export default function RecommendationsList({ recommendations = [] }) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold mb-4">Actionable Recommendations</h3>
      <div className="space-y-3">
        {recommendations.map((r, i) => (
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
    </Card>
  );
}