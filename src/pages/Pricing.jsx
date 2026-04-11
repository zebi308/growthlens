import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Building2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

const STRIPE_PRICES = {
  pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_REPLACE_WITH_YOUR_PRO_PRICE_ID',
  agency: import.meta.env.VITE_STRIPE_AGENCY_PRICE_ID || 'price_REPLACE_WITH_YOUR_AGENCY_PRICE_ID',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    icon: Star,
    color: 'from-slate-500 to-slate-600',
    accentColor: 'rgba(100,116,139,0.3)',
    border: 'border-white/10',
    badge: null,
    features: [
      '2 analyses per month',
      '1 platform connection',
      'Basic brand scorecard (overall grade only)',
      'Content calendar (7 days)',
      'Community support',
    ],
    cta: 'Current Plan',
    ctaClass: 'bg-white/10 text-muted-foreground cursor-default',
    disabled: true,
    priceId: null,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    icon: Zap,
    color: 'from-violet-600 to-purple-600',
    accentColor: 'rgba(139,92,246,0.25)',
    border: 'border-primary/40',
    badge: 'Most Popular',
    features: [
      'Unlimited analyses',
      'All platform connections',
      'Full brand scorecard with all grades',
      '30-day content calendar',
      'Trend predictions',
      'Influencer suggestions',
      'CSV & PDF exports',
      'Priority support',
    ],
    cta: 'Upgrade to Pro',
    ctaClass: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white neon-glow font-semibold',
    disabled: false,
    priceId: STRIPE_PRICES.pro,
  },
  {
    name: 'Agency',
    price: '$49',
    period: '/month',
    icon: Building2,
    color: 'from-pink-600 to-rose-600',
    accentColor: 'rgba(236,72,153,0.2)',
    border: 'border-pink-500/30',
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      'Up to 5 team seats',
      'White-label reports',
      'API access',
      'Shared workspaces',
      'Team role management',
      'Dedicated account manager',
      'SLA & uptime guarantee',
    ],
    cta: 'Upgrade to Agency',
    ctaClass: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white neon-glow-pink font-semibold',
    disabled: false,
    priceId: STRIPE_PRICES.agency,
  },
];

const gatedFeatures = {
  'Full Brand Scorecard': 'Pro',
  '30-Day Content Calendar': 'Pro',
  'Competitor Tracking': 'Pro',
  'Trend Predictions': 'Pro',
  'AI Visual Generation': 'Pro',
  'Team Workspaces': 'Agency',
  'White-label Reports': 'Agency',
  'API Access': 'Agency',
};

export default function Pricing() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleCheckout = async (plan) => {
    if (!plan.priceId || plan.disabled) return;

    setLoadingPlan(plan.name);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: plan.priceId,
          success_url: `${window.location.origin}/?upgraded=true`,
          cancel_url: `${window.location.origin}/pricing`,
          customer_email: user?.email || undefined,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary border border-primary/20 mb-4 px-3 py-1">Pricing</Badge>
        <h1 className="text-4xl lg:text-5xl font-display font-black text-foreground neon-text mb-4">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Scale your personal brand with the right tools. Upgrade anytime.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3 mb-12">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className={`glass-card rounded-2xl p-7 border ${plan.border} relative flex flex-col transition-all duration-300`}
            style={{ boxShadow: `0 0 40px ${plan.accentColor}` }}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className={`bg-gradient-to-r ${plan.color} text-white border-0 px-4 py-1 text-xs font-semibold shadow-lg`}>
                  {plan.badge}
                </Badge>
              </div>
            )}

            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5 shadow-lg`}>
              <plan.icon className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-xl font-display font-black text-foreground mb-1">{plan.name}</h2>
            <div className="flex items-end gap-1 mb-5">
              <span className="text-4xl font-black text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-sm pb-1">{plan.period}</span>
            </div>

            <ul className="space-y-3 flex-1 mb-6">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full h-10 rounded-xl ${plan.ctaClass}`}
              disabled={plan.disabled || loadingPlan === plan.name}
              onClick={() => handleCheckout(plan)}
            >
              {loadingPlan === plan.name ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                plan.cta
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="glass-card rounded-2xl p-6 neon-border"
      >
        <h3 className="font-display font-bold text-foreground mb-4">Premium Feature Access</h3>
        <div className="space-y-3">
          {Object.entries(gatedFeatures).map(([feature, minPlan]) => (
            <div key={feature} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-foreground/80">{feature}</span>
              <Badge className={minPlan === 'Pro' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'}>
                {minPlan}+
              </Badge>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Payments are securely processed by Stripe. Cancel anytime from your account.
        </p>
      </motion.div>
    </div>
  );
}
