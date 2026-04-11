import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BarChart2, Calendar, Target, TrendingUp, Users, ArrowRight, Zap, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

const features = [
  { icon: BarChart2, title: 'Brand Scorecard', desc: 'Get graded A-F on content quality, engagement, networking, and industry fit.', color: 'from-violet-500 to-purple-600' },
  { icon: Calendar, title: 'Content Calendar', desc: 'AI generates a full posting schedule with captions, hashtags, and best times.', color: 'from-pink-500 to-rose-600' },
  { icon: Target, title: 'Competitor Analysis', desc: 'See how others in your niche stack up — and get tips to outperform them.', color: 'from-blue-500 to-cyan-600' },
  { icon: TrendingUp, title: 'Growth Playbook', desc: 'Actionable recommendations tailored to your goals, industry, and platforms.', color: 'from-emerald-500 to-green-600' },
];

const steps = [
  { num: '1', title: 'Add your socials', desc: 'Instagram, TikTok, LinkedIn — paste your profile links.' },
  { num: '2', title: 'AI analyzes your brand', desc: 'Our AI reviews your presence and scores you across 5 key metrics.' },
  { num: '3', title: 'Get your growth plan', desc: 'Content calendar, competitor intel, and step-by-step recommendations.' },
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
      <section className="pt-32 pb-20 px-6">
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
              Stop guessing what to post. Outpace scans your social profiles, grades your brand, and gives you a step-by-step playbook to grow — powered by AI.
            </p>
            <div className="flex items-center justify-center gap-4">
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-black text-foreground mb-4">Everything you need to grow</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">One analysis gives you a complete brand strategy — scores, content plan, competitor intel, and actionable tips.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-7 neon-border"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-display font-black text-foreground mb-4">How it works</h2>
            <p className="text-muted-foreground">Three steps. Thirty seconds. Total clarity on your brand.</p>
          </motion.div>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 glass-card rounded-2xl p-6 neon-border"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-black text-primary">{s.num}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-12 neon-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Ready to outpace your competition?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join creators who use AI to grow smarter, not harder.</p>
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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
