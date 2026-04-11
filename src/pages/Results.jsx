import React from 'react';
import { Link } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Calendar, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import BrandScorecard from '@/components/results/BrandScorecard';
import StrengthsWeaknesses from '@/components/results/StrengthsWeaknesses';
import RecommendationsList from '@/components/results/RecommendationsList';

export default function Results() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: () => appClient.entities.BrandAnalysis.list(),
  });

  const analysis = analyses.find(a => a.id === id);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Card key={i} className="p-8 animate-pulse"><div className="h-20 bg-muted rounded" /></Card>)}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Analysis not found.</p>
        <Link to="/dashboard"><Button variant="ghost" className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" />Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">{analysis.industry}</h1>
            <p className="text-muted-foreground text-sm mt-1">{(analysis.goals || []).join(' · ')}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/recommendations?id=${id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                <Lightbulb className="w-4 h-4" /> Tips
              </Button>
            </Link>
            <Link to={`/content-calendar?id=${id}`}>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
                <Calendar className="w-4 h-4" /> Calendar
              </Button>
            </Link>
          </div>
        </div>

        {analysis.brand_summary && (
          <Card className="p-6 mb-6">
            <p className="text-foreground leading-relaxed">{analysis.brand_summary}</p>
          </Card>
        )}

        <div className="space-y-6">
          <BrandScorecard analysis={analysis} />
          <StrengthsWeaknesses strengths={analysis.strengths} weaknesses={analysis.weaknesses} />
          <RecommendationsList recommendations={analysis.recommendations} />
        </div>
      </motion.div>
    </div>
  );
}