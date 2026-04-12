import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CalendarClock, Sparkles, Lock, Check, Zap, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: TrendingUp,
    color: 'from-pink-500 to-rose-600',
    glow: '0 0 30px rgba(236,72,153,0.4)',
    badge: 'Coming Soon',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    title: 'Engagement Forecast',
    subtitle: 'Plan your growth before posting',
    description: 'AI simulates how your engagement will grow over the next 7–14 days based on your posting plan. See projected followers, reach, likes, and comments before you even hit publish.',
    plan: 'Available in Pro & Agency plans',
    perks: [
      'Day-by-day engagement & follower projections',
      'Best-case / realistic / worst-case scenarios',
      'Niche-calibrated growth benchmarks',
      'Post-by-post impact scoring',
    ],
  },
  {
    icon: CalendarClock,
    color: 'from-cyan-500 to-blue-600',
    glow: '0 0 30px rgba(6,182,212,0.4)',
    badge: 'Coming Soon',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    title: 'Multi-Platform Scheduler',
    subtitle: 'All-in-one growth assistant',
    description: 'Schedule your AI-generated posts directly to Instagram, TikTok, LinkedIn, and Twitter/X — right from the app. Smart push reminders based on your AI-optimized posting times.',
    plan: 'Available in Pro & Agency plans',
    perks: [
      'One-click scheduling to 4 platforms',
      'AI-optimized time slot recommendations',
      'Push & email reminders before posting',
      'Bulk schedule your entire content calendar',
    ],
  },
];

export default function Premium() {
  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
          <Zap className="w-3.5 h-3.5" /> Premium Features
        </div>
        <h1 className="text-4xl lg:text-5xl font-display font-black text-foreground mb-4 neon-text">
          Unlock Your Full<br />Brand Potential
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Supercharge your personal brand with AI-powered tools used by top creators to 10× their growth.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="glass-card rounded-2xl p-7 lg:p-8 flex flex-col lg:flex-row gap-7 lg:gap-10 transition-all duration-300"
            style={{ boxShadow: f.glow.replace('0.4', '0.1') }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = f.glow}
            onMouseLeave={e => e.currentTarget.style.boxShadow = f.glow.replace('0.4', '0.1')}
          >
            <div className="flex-shrink-0 flex flex-col items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg`}>
                <f.icon className="w-8 h-8 text-white" />
              </div>
              <Badge className={`border text-xs ${f.badgeColor}`}>{f.badge}</Badge>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">{f.subtitle}</p>
              <h2 className="text-2xl font-display font-black text-foreground mb-3">{f.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-2">{f.description}</p>
              <p className="text-xs text-primary font-semibold mb-4">{f.plan}</p>
              <ul className="space-y-2">
                {f.perks.map((perk, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-shrink-0 flex flex-col items-start lg:items-end justify-between gap-4 lg:min-w-[140px]">
              <div className="text-right hidden lg:block">
                <p className="text-2xl font-black text-foreground">Coming</p>
                <p className="text-sm text-muted-foreground">Soon</p>
              </div>
              <Button
                className={`gap-2 w-full lg:w-auto bg-gradient-to-r ${f.color} border-0 text-white font-semibold opacity-80 cursor-not-allowed`}
                disabled
              >
                <Lock className="w-4 h-4" /> Join Waitlist
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Visual & Video Generator - Agency Only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 glass-card rounded-2xl p-7 lg:p-8 flex flex-col lg:flex-row gap-7 lg:gap-10 transition-all duration-300"
        style={{ boxShadow: '0 0 30px rgba(245,158,11,0.1)' }}
      >
        <div className="flex-shrink-0 flex flex-col items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Image className="w-8 h-8 text-white" />
          </div>
          <Badge className="border text-xs bg-amber-500/20 text-amber-300 border-amber-500/30">Coming Soon</Badge>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-1">Create without a designer</p>
          <h2 className="text-2xl font-display font-black text-foreground mb-3">AI Visual & Video Generator</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Generate on-brand images and short video clips tailored to your post ideas — perfect for Instagram Reels, TikTok Shorts, and more. Photo-based posts are coming first, with video generation following shortly after.
          </p>
          <p className="text-xs text-amber-400 font-semibold mb-4">Bonus feature — exclusive to Agency plan members</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2.5 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              AI-generated images matching your brand style
            </li>
            <li className="flex items-start gap-2.5 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              Ready-to-post visuals for every calendar day
            </li>
            <li className="flex items-start gap-2.5 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              Short-form video clips for Reels & TikTok
            </li>
            <li className="flex items-start gap-2.5 text-sm text-foreground/80">
              <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              Photo-based posts launching first — video coming soon
            </li>
          </ul>
        </div>

        <div className="flex-shrink-0 flex flex-col items-start lg:items-end justify-between gap-4 lg:min-w-[140px]">
          <div className="text-right hidden lg:block">
            <p className="text-2xl font-black text-foreground">Coming</p>
            <p className="text-sm text-muted-foreground">Soon</p>
          </div>
          <Button
            className="gap-2 w-full lg:w-auto bg-gradient-to-r from-amber-400 to-orange-500 border-0 text-white font-semibold opacity-80 cursor-not-allowed"
            disabled
          >
            <Lock className="w-4 h-4" /> Agency Only
          </Button>
        </div>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 text-center"
      >
        <p className="text-muted-foreground text-sm mb-4">Want to be the first to access these features?</p>
        <Link to="/dashboard/pricing">
          <Button className="gap-2 rounded-xl px-8 neon-glow font-semibold">
            <Zap className="w-4 h-4" /> View Plans & Pricing
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
