import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const platformColors = {
  Instagram: 'bg-pink-900/30 text-pink-400',
  TikTok: 'bg-purple-900/30 text-purple-400',
  YouTube: 'bg-red-900/30 text-red-400',
  'Twitter/X': 'bg-sky-900/30 text-sky-400',
  LinkedIn: 'bg-blue-900/30 text-blue-400',
};

export default function InfluencerSuggestions({ influencers = [] }) {
  if (!influencers.length) return null;

  return (
    <Card className="p-6">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" /> Collab Opportunities
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Creators to partner with in your niche</p>
      <div className="space-y-3">
        {influencers.map((inf, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
              {inf.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h4 className="text-sm font-semibold text-foreground">{inf.name}</h4>
                {inf.platform && (
                  <Badge className={`${platformColors[inf.platform] || 'bg-muted text-muted-foreground'} text-[10px]`}>
                    {inf.platform}
                  </Badge>
                )}
                {inf.niche && (
                  <Badge variant="outline" className="text-[10px]">{inf.niche}</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{inf.why_collab}</p>
              {inf.profile_url && (
                <a
                  href={inf.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                >
                  View Profile <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}