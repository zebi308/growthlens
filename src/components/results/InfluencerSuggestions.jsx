import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, Lock, Zap } from 'lucide-react';
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

function InfluencerCard({ inf }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
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
          <a href={inf.profile_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
            View Profile <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function InfluencerSuggestions({ influencers = [] }) {
  const { isPro } = useUserPlan();
  if (!influencers.length) return null;

  const visibleCount = isPro ? influencers.length : FREE_LIMIT;
  const visible = influencers.slice(0, visibleCount);
  const locked = influencers.slice(visibleCount);
  // Show at least 3 blurred items for motivation
  const blurredToShow = Math.max(locked.length, 3);
  const blurredItems = locked.length > 0 ? locked : influencers.slice(0, 3);

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" /> Collab Opportunities
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Creators in your country to partner with in your niche</p>
      <div className="space-y-3">
        {visible.map((inf, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <InfluencerCard inf={inf} />
          </motion.div>
        ))}
      </div>

      {!isPro && (
        <div className="relative mt-3">
          <div className="space-y-3 blur-sm pointer-events-none opacity-40">
            {blurredItems.slice(0, 4).map((inf, i) => (
              <InfluencerCard key={`blur-${i}`} inf={inf} />
            ))}
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-3">+{Math.max(locked.length, 2)} more collab suggestions</p>
            <Link to="/dashboard/pricing">
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
