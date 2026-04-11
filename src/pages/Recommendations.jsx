import React from 'react';
import { Link } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import RecommendationsList from '@/components/results/RecommendationsList';
import TrendPredictions from '@/components/results/TrendPredictions';
import InfluencerSuggestions from '@/components/results/InfluencerSuggestions';
import ExportMenu from '@/components/shared/ExportMenu';
import { exportNetworkingCsv, exportNetworkingPdf } from '@/utils/exportHelpers';

export default function Recommendations() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses-recs'],
    queryFn: () => appClient.entities.BrandAnalysis.list('-created_date', 20),
  });

  const analysis = id ? analyses.find(a => a.id === id) : analyses.find(a => a.status === 'completed');

  if (isLoading) {
    return <div className="p-6 lg:p-10 max-w-4xl mx-auto"><Card className="p-12 animate-pulse"><div className="h-40 bg-muted rounded" /></Card></div>;
  }

  if (!analysis) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">No completed analysis found. Run an analysis first.</p>
        <Link to="/new-analysis"><Button>Start New Analysis</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to={id ? `/results?id=${id}` : '/'} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">Recommendations</h1>
        <p className="text-muted-foreground mb-8">Actionable tips to improve your personal brand</p>

        <RecommendationsList recommendations={analysis.recommendations} />

        <TrendPredictions trends={analysis.trend_predictions} />
        <InfluencerSuggestions influencers={analysis.influencer_suggestions} />

        {analysis.networking_opportunities && analysis.networking_opportunities.length > 0 && (
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Networking Opportunities
              </h3>
              <ExportMenu
                label="Export"
                onExportCsv={() => exportNetworkingCsv(analysis.networking_opportunities, analysis.industry)}
                onExportPdf={() => exportNetworkingPdf(analysis.networking_opportunities, analysis.industry)}
              />
            </div>
            <div className="space-y-3">
              {analysis.networking_opportunities.map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{n.name}</h4>
                    <Badge variant="secondary" className="text-[10px]">{n.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.description}</p>
                  {n.url && (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                      Visit →
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}