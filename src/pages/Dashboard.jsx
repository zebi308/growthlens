import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, TrendingUp, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedStatCard from '@/components/dashboard/AnimatedStatCard';
import BrandScoreChart from '@/components/dashboard/BrandScoreChart';
import PlatformDonut from '@/components/dashboard/PlatformDonut';
import BrandHealthTips from '@/components/dashboard/BrandHealthTips';
import KanbanAnalysisCard from '@/components/dashboard/KanbanAnalysisCard';

const gradeToRadial = { A: 95, B: 78, C: 60, D: 42, F: 18 };
const FILTER_TABS = ['All', 'Completed', 'In Progress', 'Failed'];

function computeStats(analyses) {
  const completed = analyses.filter(a => a.status === 'completed');
  const gradeMap = { A: 5, B: 4, C: 3, D: 2, F: 1 };
  const reverseMap = { 5: 'A', 4: 'B', 3: 'C', 2: 'D', 1: 'F' };
  const avg = completed.length > 0
    ? Math.round(completed.reduce((s, a) => s + (gradeMap[a.overall_grade] || 0), 0) / completed.length)
    : 0;
  const goals = analyses.reduce((s, a) => s + (a.goals?.length || 0), 0);
  const platforms = new Set();
  analyses.forEach(a => {
    if (a.instagram_url) platforms.add('Instagram');
    if (a.tiktok_url) platforms.add('TikTok');
    if (a.youtube_url) platforms.add('YouTube');
    if (a.twitter_url) platforms.add('Twitter');
    if (a.linkedin_url) platforms.add('LinkedIn');
    if (a.facebook_url) platforms.add('Facebook');
  });
  return {
    total: analyses.length,
    avgGrade: reverseMap[avg] || '—',
    avgRadial: avg ? gradeToRadial[reverseMap[avg]] || 50 : 0,
    goals,
    platforms: platforms.size,
  };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    appClient.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses', currentUser?.email],
    enabled: !!currentUser,
    queryFn: () => appClient.entities.BrandAnalysis.filter({ created_by: currentUser.email }, '-created_date', 50),
  });

  const stats = computeStats(analyses);

  const filteredAnalyses = analyses.filter(a => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Completed') return a.status === 'completed';
    if (activeTab === 'In Progress') return a.status === 'analyzing' || a.status === 'pending';
    if (activeTab === 'Failed') return a.status === 'failed';
    return true;
  });

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-display font-black text-foreground neon-text">Your Brand Hub</h1>
            <p className="text-muted-foreground mt-1">AI-powered personal branding insights</p>
          </div>
          <Link to="/dashboard/new-analysis">
            <Button className="gap-2 rounded-xl px-6 h-11 neon-glow font-semibold">
              <Plus className="w-4 h-4" /> New Analysis
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnimatedStatCard
          icon={Sparkles} label="Total Analyses"
          value={isLoading ? 0 : stats.total}
          color="bg-primary/10 text-primary"
          accentColor="#a855f7"
          type="number" delay={0}
        />
        <AnimatedStatCard
          icon={TrendingUp} label="Avg. Grade"
          value={isLoading ? '—' : stats.avgGrade}
          color="bg-emerald-500/10 text-emerald-400"
          accentColor="#10b981"
          radialPct={isLoading ? 0 : stats.avgRadial}
          ringColor="#10b981"
          type="grade" delay={0.05}
        />
        <AnimatedStatCard
          icon={Target} label="Goals Tracked"
          value={isLoading ? 0 : stats.goals}
          color="bg-pink-500/10 text-pink-400"
          accentColor="#ec4899"
          radialPct={isLoading ? 0 : Math.min(100, stats.goals * 10)}
          ringColor="#ec4899"
          type="number" delay={0.1}
        />
        <AnimatedStatCard
          icon={Users} label="Platforms"
          value={isLoading ? 0 : stats.platforms}
          color="bg-blue-500/10 text-blue-400"
          accentColor="#38bdf8"
          type="number" delay={0.15}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <BrandScoreChart analyses={analyses} />
        </div>
        <PlatformDonut analyses={analyses} />
      </div>

      <div className="mb-8">
        <BrandHealthTips analyses={analyses} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-semibold text-foreground">Recent Analyses</h2>
          <div className="flex items-center gap-1 bg-muted/40 rounded-xl p-1">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse neon-border h-32" />
            ))}
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center neon-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 neon-glow">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {activeTab === 'All' ? 'No analyses yet' : `No ${activeTab.toLowerCase()} analyses`}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {activeTab === 'All' ? 'Start by creating your first brand analysis.' : `Switch to "All" to see other analyses.`}
            </p>
            {activeTab === 'All' && (
              <Link to="/dashboard/new-analysis">
                <Button className="gap-2 rounded-xl neon-glow font-semibold">
                  <Plus className="w-4 h-4" /> Create First Analysis
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAnalyses.map(a => (
              <KanbanAnalysisCard key={a.id} analysis={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
