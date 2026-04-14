import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BarChart2, Calendar, Target, TrendingUp, Users, ArrowRight, Zap, Check, Star, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

const features = [
  { icon: BarChart2, title: 'Brand Scorecard', desc: 'Get graded A-F across content quality, engagement, networking, and industry fit — with detailed tips for each.', color: 'from-violet-500 to-purple-600' },
  { icon: Calendar, title: '14-Day Content Calendar', desc: 'AI generates daily posts with captions, hashtags, best posting times, and engagement predictions.', color: 'from-pink-500 to-rose-600' },
  { icon: Target, title: 'Competitor Intelligence', desc: 'Analyze up to 5 competitors — see their strategy, strengths, weaknesses, and how to outperform them.', color: 'from-blue-500 to-cyan-600' },
  { icon: TrendingUp, title: 'Growth Playbook', desc: 'Actionable recommendations personalized to your niche, goals, and current brand performance.', color: 'from-emerald-500 to-green-600' },
  { icon: Users, title: 'Collab & Networking', desc: 'AI suggests creators to collaborate with and networking communities — filtered to your country.', color: 'from-amber-500 to-orange-600' },
  { icon: Star, title: 'Trend Predictions', desc: '7-day trending topics in your niche with ready-to-use content ideas and posting strategies.', color: 'from-indigo-500 to-blue-600' },
];

const steps = [
  { num: '1', title: 'Add your social links', desc: 'Paste your Instagram, TikTok, LinkedIn, YouTube, Twitter, or Facebook profile URLs.' },
  { num: '2', title: 'AI analyzes everything', desc: 'Our AI scans your brand presence, evaluates your content strategy, and benchmarks you against your niche.' },
  { num: '3', title: 'Get your growth plan', desc: 'Receive a full brand report with scores, a 14-day content calendar, competitor insights, and step-by-step recommendations.' },
];

const stats = [
  { value: '30s', label: 'Average analysis time' },
  { value: '14', label: 'Days of content generated' },
  { value: '5', label: 'Key metrics scored' },
  { value: '100%', label: 'AI-powered insights' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Outpace</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="gap-2 rounded-xl">Go to Dashboard <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">Sign In</Button>
                </Link>
                <Link to="/login?signup=true">
                  <Button className="gap-2 rounded-xl text-sm">Get Started Free <ArrowRight className="w-4 h-4" /></Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-primary/10 text-primary border border-primary/20 mb-6 px-4 py-1.5 text-sm">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> AI-Powered Brand Analysis
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-display font-black text-foreground leading-[1.1] mb-6 neon-text">
              Your personal brand,<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">analyzed by AI.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop guessing what to post. Outpace scans your social profiles, grades your brand across 5 key metrics, and gives you a complete growth playbook — content calendar, competitor insights, and actionable tips.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to={isAuthenticated ? '/dashboard/new-analysis' : '/login?signup=true'}>
                <Button size="lg" className="gap-2 rounded-xl px-8 h-12 neon-glow font-semibold text-base">
                  <Sparkles className="w-5 h-5" /> Analyze My Brand — Free
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">No credit card required · 2 free analyses per month</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-6"
              >
                <p className="text-3xl lg:text-4xl font-black text-primary mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-black text-foreground mb-4">Everything you need to grow</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">One analysis gives you a complete brand strategy — scores, content plan, competitor intel, and actionable tips.</p>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 neon-border hover:scale-[1.02] transition-transform"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-black text-foreground mb-4">How it works</h2>
            <p className="text-muted-foreground">Three steps. Thirty seconds. Total clarity.</p>
          </motion.div>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-5 glass-card rounded-2xl p-6 neon-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-primary">{s.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8 neon-border">
            <h2 className="text-2xl font-display font-black text-foreground mb-6 text-center">What's in your free analysis?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Overall brand grade (A-F)',
                '2 key strengths identified',
                '2 areas for improvement',
                '7-day content calendar with captions',
                '4 actionable recommendations',
                'Hashtag suggestions per post',
                'Best posting times for your niche',
                'Engagement predictions per post',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground mb-4">Upgrade to Pro for unlimited analyses, 30-day calendars, competitor tracking, and more</p>
              <Link to={isAuthenticated ? '/dashboard/pricing' : '/login?signup=true'}>
                <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                  <Zap className="w-3 h-3" /> See Pro Features
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Secure</p>
              <p className="text-xs text-muted-foreground">Data encrypted & private</p>
            </div>
            <div>
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Fast</p>
              <p className="text-xs text-muted-foreground">Results in 30 seconds</p>
            </div>
            <div>
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">AI-Powered</p>
              <p className="text-xs text-muted-foreground">GPT-4 level analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-12 neon-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Ready to outpace your competition?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join creators who use AI to grow smarter. Your first analysis is free.</p>
            <Link to={isAuthenticated ? '/dashboard/new-analysis' : '/login?signup=true'}>
              <Button size="lg" className="gap-2 rounded-xl px-8 h-12 neon-glow font-semibold">
                <Sparkles className="w-5 h-5" /> Start Free Analysis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Outpace</span>
          </div>
          <p className="text-xs text-muted-foreground">AI-Powered Growth · Built by Clariana</p>
        </div>
      </footer>
    </div>
  );
}
