import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GradeCircle from '@/components/dashboard/GradeCircle';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserPlan } from '@/hooks/useUserPlan';

const dimensionDetails = {
  'Content Quality': {
    description: 'How well your posts are crafted — visuals, copy, storytelling, and consistency.',
    tips: ['Use Reels for 3–5x more reach', 'Post carousels for saves & shares', 'Strong hooks in first 3 seconds'],
  },
  'Engagement': {
    description: 'How your audience interacts with your content — likes, comments, saves, DMs.',
    tips: ['Reply to every comment in first hour', 'Use polls & question stickers in Stories', 'Ask CTAs that invite responses'],
  },
  'Networking': {
    description: 'Your ability to build relationships and collaborations in your niche.',
    tips: ['Collab with creators in adjacent niches', 'Engage authentically on others\' posts', 'Join niche-specific communities'],
  },
  'Industry Fit': {
    description: 'How well your content aligns with your stated industry and target audience.',
    tips: ['Use niche-specific hashtags', 'Reference trending topics in your field', 'Show your expertise consistently'],
  },
};

const gradeExplanations = {
  A: 'Excellent — Top-tier brand presence. Strong across all metrics.',
  B: 'Good — Solid presence with room for optimization.',
  C: 'Average — Decent foundation but needs consistent effort.',
  D: 'Below Average — Significant gaps in strategy or execution.',
  F: 'Needs Attention — Major improvements needed across the board.',
};

function DimensionCard({ dimension, index, locked }) {
  const [hovered, setHovered] = useState(false);
  const details = dimensionDetails[dimension.label];

  return (
    <motion.div
      key={dimension.label}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="relative flex flex-col items-center cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {locked ? (
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <div className="blur-sm pointer-events-none opacity-30">
              <GradeCircle grade={dimension.grade || 'B'} label="" size="sm" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">{dimension.label}</p>
        </div>
      ) : (
        <>
          <GradeCircle grade={dimension.grade} label={dimension.label} size="sm" />
          <AnimatePresence>
            {hovered && details && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 w-56 bg-popover border border-border rounded-xl p-3 shadow-xl"
              >
                <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{details.description}</p>
                <ul className="space-y-1">
                  {details.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border" />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default function BrandScorecard({ analysis }) {
  const { isPro } = useUserPlan();
  const [showTooltip, setShowTooltip] = useState(false);

  const dimensions = [
    { grade: analysis.content_quality_grade, label: 'Content Quality' },
    { grade: analysis.engagement_grade, label: 'Engagement' },
    { grade: analysis.networking_grade, label: 'Networking' },
    { grade: analysis.alignment_grade, label: 'Industry Fit' },
  ];

  return (
    <Card className="p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold">Brand Score</h3>
        {isPro ? (
          <span className="text-xs text-muted-foreground">Hover scores for tips</span>
        ) : (
          <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px]">
            Free Plan — Overall Grade Only
          </Badge>
        )}
      </div>

      {/* Overall Grade with hover tooltip */}
      <div
        className="flex flex-col items-center mb-8 relative cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <GradeCircle grade={analysis.overall_grade} label="Overall" size="lg" />
        <AnimatePresence>
          {showTooltip && analysis.overall_grade && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute top-full mt-3 z-50 bg-popover border border-border rounded-xl p-4 shadow-xl max-w-xs text-center"
            >
              <p className="text-sm font-semibold text-foreground mb-1">Grade: {analysis.overall_grade}</p>
              <p className="text-xs text-muted-foreground">{gradeExplanations[analysis.overall_grade] || ''}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub grades - labels visible, scores blurred for free */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {dimensions.map((d, i) => (
          <DimensionCard key={d.label} dimension={d} index={i} locked={!isPro} />
        ))}
      </div>

      {!isPro && (
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground mb-3">
            Upgrade to Pro to unlock detailed scores for Content Quality, Engagement, Networking & Industry Fit
          </p>
          <Link to="/dashboard/pricing">
            <Button size="sm" className="gap-1.5 rounded-lg">
              <Zap className="w-3 h-3" /> Upgrade to Pro
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
