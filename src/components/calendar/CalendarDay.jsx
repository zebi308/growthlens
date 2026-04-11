import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Hash, MessageSquare, Image, Copy, Check, TrendingUp, Film, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const platformColors = {
  LinkedIn: 'bg-blue-900/30 text-blue-400',
  Twitter: 'bg-sky-900/30 text-sky-400',
  'Twitter/X': 'bg-sky-900/30 text-sky-400',
  Instagram: 'bg-pink-900/30 text-pink-400',
  TikTok: 'bg-purple-900/30 text-purple-400',
  YouTube: 'bg-red-900/30 text-red-400',
  Facebook: 'bg-blue-900/30 text-blue-400',
};

const postTypeIcon = (type) => {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes('reel') || t.includes('video') || t.includes('short')) return <Film className="w-3 h-3" />;
  if (t.includes('carousel') || t.includes('grid')) return <LayoutGrid className="w-3 h-3" />;
  return null;
};

export default function CalendarDay({ item, index }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = [item.caption, item.hashtags, item.cta].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeIcon = postTypeIcon(item.post_type || item.media_suggestion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="p-5 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Day {item.day}</span>
          <div className="flex items-center gap-1.5">
            {typeIcon && (
              <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0.5">
                {typeIcon}
                {item.post_type || 'Reel'}
              </Badge>
            )}
            <Badge className={`${platformColors[item.platform] || 'bg-muted text-muted-foreground'} text-[10px]`}>
              {item.platform}
            </Badge>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-foreground mb-2">{item.topic}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{item.caption}</p>

        {/* Engagement prediction */}
        {item.engagement_prediction && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 mb-3 bg-emerald-50 rounded-lg px-2.5 py-1.5">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span>{item.engagement_prediction}</span>
          </div>
        )}

        <div className="space-y-1.5 mb-4">
          {item.hashtags && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Hash className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="text-primary/80">{item.hashtags}</span>
            </div>
          )}
          {item.cta && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{item.cta}</span>
            </div>
          )}
          {item.media_suggestion && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Image className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{item.media_suggestion}</span>
            </div>
          )}
          {item.best_time && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{item.best_time}</span>
            </div>
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          className="w-full gap-1.5 text-xs h-8"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Caption'}
        </Button>
      </Card>
    </motion.div>
  );
}