import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/wizard/StepIndicator';
import ProfilesStep from '@/components/wizard/ProfilesStep';
import IndustryStep from '@/components/wizard/IndustryStep';
import GoalsStep from '@/components/wizard/GoalsStep';
import ReviewStep from '@/components/wizard/ReviewStep';

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({
    linkedin_url: '', twitter_url: '', instagram_url: '', tiktok_url: '', youtube_url: '',
    industry: '', goals: [], existing_content: '',
  });

  useEffect(() => {
    appClient.auth.me().then(u => {
      setCurrentUser(u);
      checkLimit(u);
    }).catch(() => {});
  }, []);

  const checkLimit = async (user) => {
    if (!user) return;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const allAnalyses = await appClient.entities.BrandAnalysis.filter({ created_by: user.email }, '-created_date', 100);
    const thisMonth = allAnalyses.filter(a => a.created_date >= startOfMonth);
    if (thisMonth.length >= 2 && (user.role === 'user' || !user.role)) {
      setLimitReached(true);
    }
  };

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return data.industry;
    if (step === 2) return data.goals.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (currentUser) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const allAnalyses = await appClient.entities.BrandAnalysis.filter({ created_by: currentUser.email }, '-created_date', 100);
      const thisMonth = allAnalyses.filter(a => a.created_date >= startOfMonth);
      if (thisMonth.length >= 2 && (currentUser.role === 'user' || !currentUser.role)) {
        setLimitReached(true);
        setSubmitting(false);
        return;
      }
    }
    const record = await appClient.entities.BrandAnalysis.create({
      ...data,
      status: 'analyzing',
    });
    navigate(`/analyzing?id=${record.id}`);
  };

  if (limitReached) {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl p-10 neon-border text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Monthly Limit Reached</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You've reached your free limit of 2 analyses this month. Upgrade to Pro for unlimited analyses.
          </p>
          <a href="/pricing">
            <Button className="gap-2 neon-glow rounded-xl px-8">
              <Sparkles className="w-4 h-4" /> Upgrade to Pro
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const steps = [
    <ProfilesStep data={data} onChange={update} />,
    <IndustryStep data={data} onChange={update} />,
    <GoalsStep data={data} onChange={update} />,
    <ReviewStep data={data} />,
  ];

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <StepIndicator current={step} />
      <Card className="p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="gap-2 rounded-xl px-6"
            >
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || !canNext()}
              className="gap-2 rounded-xl px-6 shadow-lg shadow-primary/20"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {submitting ? 'Starting...' : 'Run Analysis'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}