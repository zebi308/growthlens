import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Lock, Zap, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import RecommendationsList from '@/components/results/RecommendationsList';
import TrendPredictions from '@/components/results/TrendPredictions';
import InfluencerSuggestions from '@/components/results/InfluencerSuggestions';
import ExportMenu from '@/components/shared/ExportMenu';
import { exportNetworkingCsv, exportNetworkingPdf } from '@/utils/exportHelpers';
import { useUserPlan } from '@/hooks/useUserPlan';
import { getAnalysisLabel } from '@/utils/analysisHelpers';
import { format } from 'date-fns';

const FREE_NETWORKING_LIMIT = 1;

export default function Recommendations() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const { isPro } = useUserPlan();
  const [selectedId, setSelectedId] = useState(id || null);

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses-recs'],
    queryFn: () => appClient.entities.BrandAnalysis.list('-created_date', 20),
  });

  const completedAnalyses = analyses.filter(a => a.status === 'completed');
  const analysis = selectedId ? completedAnalyses.find(a => a.id === selectedId) : completedAnalyses[0];

  if (isLoading) {
    return <div className="p-6 lg:p-10 max-w-4xl mx-auto"><Card className="p-12 animate-pulse"><div className="h-40 bg-muted rounded" /></Card></div>;
  }

  if (!analysis) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">No completed analysis found. Run an analysis first.</p>
        <Link to="/dashboard/new-analysis"><Button>Start New Analysis</Button></Link>
      </div>
    );
  }

  const networking = analysis.networking_opportunities || [];
  const visibleNetworking = isPro ? networking : networking.slice(0, FREE_NETWORKING_LIMIT);
  const lockedNetworking = isPro ? [] : networking.slice(FREE_NETWORKING_LIMIT);
  const currentLabel = getAnalysisLabel(analysis);

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={selectedId ? `/dashboard/results?id=${selectedId}` : '/dashboard'} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Recommendations</h1>
        <p className="text-muted-foreground mb-4">Actionable tips to improve your personal brand</p>

        {/* Current analysis info */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{currentLabel.username}</span>
          {currentLabel.platforms.map(p => (
            <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
          ))}
        </div>

        {/* Analysis Selector */}
        {completedAnalyses.length > 1 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Select analysis</p>
            <div className="flex flex-wrap gap-2">
              {completedAnalyses.map((a) => {
                const label = getAnalysisLabel(a);
                return (
                  <button key={a.id} onClick={() => setSelectedId(a.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                      (selectedId || analysis.id) === a.id ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-semibold">{label.username}</span>
                    <span className="text-muted-foreground ml-1">· {label.platforms.join(', ')}</span>
                    <span className="text-muted-foreground ml-1">· {a.created_date ? format(new Date(a.created_date), 'MMM d') : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <RecommendationsList recommendations={analysis.recommendations} />
        <TrendPredictions trends={analysis.trend_predictions} />
        <InfluencerSuggestions influencers={analysis.influencer_suggestions} />

        {networking.length > 0 && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Networking Opportunities
              </h3>
              {isPro && (
                <ExportMenu label="Export" onExportCsv={() => exportNetworkingCsv(networking, analysis.industry)} onExportPdf={() => exportNetworkingPdf(networking, analysis.industry)} />
              )}
            </div>
            <div className="space-y-3">
              {visibleNetworking.map((n, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{n.name}</h4>
                    <Badge variant="secondary" className="text-[10px]">{n.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.description}</p>
                  {n.url && (
                    <a href={n.url.startsWith('http') ? n.url : `https://${n.url}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1">
                      Visit <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
            {!isPro && lockedNetworking.length > 0 && (
              <div className="relative mt-3">
                <div className="space-y-3 blur-sm pointer-events-none opacity-40">
                  {(lockedNetworking.length > 0 ? lockedNetworking : networking).slice(0, 4).map((n, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 border border-border/50">
                      <h4 className="text-sm font-semibold text-foreground">{n.name}</h4>
                      <p className="text-sm text-muted-foreground">{n.description}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-3">+{Math.max(lockedNetworking.length, 3)} more networking opportunities</p>
                  <Link to="/dashboard/pricing"><Button size="sm" className="gap-1.5 rounded-lg text-xs"><Zap className="w-3 h-3" /> Upgrade to Pro</Button></Link>
                </div>
              </div>
            )}
          </Card>
        )}
      </motion.div>
    </div>
  );
}
