import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, BarChart2, Loader2, TrendingUp, TrendingDown, Target, Lightbulb, ChevronDown, ChevronUp, Search, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { useUserPlan } from '@/hooks/useUserPlan';

const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];
const METRICS = ['Brand Score', 'Engagement', 'Audience Growth', 'Content Quality', 'Consistency'];
const FREE_HANDLE_LIMIT = 3;

function extractUsername(input) {
  const trimmed = input.trim().replace(/\/+$/, '');
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const parts = url.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    const clean = last.replace(/^@/, '').split('?')[0];
    return clean || trimmed;
  } catch {
    return trimmed.replace(/^@/, '') || trimmed;
  }
}

function getDisplayName(handle) {
  return extractUsername(handle);
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'text-green-400 bg-green-400/10'
    : score >= 60 ? 'text-amber-400 bg-amber-400/10'
    : 'text-red-400 bg-red-400/10';
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Average' : 'Weak';
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-foreground font-semibold text-sm">{score}</span>
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${color}`}>{label}</span>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-foreground font-semibold">{payload[0]?.payload?.metric}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>@{getDisplayName(p.name)}: {p.value}/100</p>
      ))}
    </div>
  );
}

function CompetitorCard({ data, color, index }) {
  const [expanded, setExpanded] = useState(false);
  const displayName = getDisplayName(data.handle);
  const avgScore = Math.round(
    (data.brand_score + data.engagement + data.audience_growth + data.content_quality + data.consistency) / 5
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl p-5 neon-border"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: color }}>
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">@{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{data.niche}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-black text-foreground">{avgScore}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Overall</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {[
          { label: 'Brand', value: data.brand_score },
          { label: 'Engage', value: data.engagement },
          { label: 'Growth', value: data.audience_growth },
          { label: 'Content', value: data.content_quality },
          { label: 'Consist.', value: data.consistency },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
            <div className="w-full h-1 rounded-full bg-white/5 mt-1">
              <div className="h-full rounded-full transition-all" style={{ width: `${s.value}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 rounded-xl p-3 mb-3">
        <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
          <Target className="w-3 h-3 text-primary" /> Strategy
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{data.strategy}</p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors w-full justify-center py-1 cursor-pointer"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? 'Show less' : 'Show strengths, weaknesses & tips'}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> What they do well
                </p>
                <ul className="space-y-1">
                  {(data.strengths || []).map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-400 mb-1.5 flex items-center gap-1.5">
                  <TrendingDown className="w-3 h-3" /> Where they fall short
                </p>
                <ul className="space-y-1">
                  {(data.weaknesses || []).map((w, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                <p className="text-xs font-semibold text-primary mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3" /> How to outperform them
                </p>
                <ul className="space-y-1">
                  {(data.how_to_beat || []).map((t, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
              </div>
              {data.top_content_types && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">Top content types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {data.top_content_types.map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-[10px] py-0.5">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Competitors() {
  const [handles, setHandles] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const { isPro } = useUserPlan();
  const maxHandles = isPro ? 5 : FREE_HANDLE_LIMIT;

  const addHandle = () => {
    const h = input.trim();
    if (!h || handles.includes(h)) return;
    if (handles.length >= maxHandles) {
      setError(isPro ? 'Maximum 5 competitors at a time' : `Free plan allows ${FREE_HANDLE_LIMIT} competitors. Upgrade to Pro for up to 5.`);
      return;
    }
    setHandles(prev => [...prev, h]);
    setInput('');
    setError(null);
  };

  const removeHandle = (h) => {
    setHandles(prev => prev.filter(x => x !== h));
    if (analysisData) {
      setAnalysisData(prev => prev ? prev.filter(x => x.handle !== h) : null);
    }
    setError(null);
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        handles.map(async (handle) => {
          const res = await appClient.integrations.Core.InvokeLLM({
            prompt: `You are a social media brand strategist. Analyze the public brand presence of "${handle}".

Return a detailed competitive analysis with:
- Scores 0-100 for: brand_score, engagement, audience_growth, content_quality, consistency. Be realistic — most accounts score 40-75. Only exceptional brands score 80+.
- niche: One-line description of their niche/positioning (max 10 words).
- strategy: 2-3 sentence summary of their overall brand strategy.
- strengths: 3 specific things they do well (each 1 sentence).
- weaknesses: 3 specific gaps or missed opportunities (each 1 sentence).
- how_to_beat: 3 actionable tips for a competitor to outperform them (each 1 sentence).
- top_content_types: Array of 3-5 content formats they use most.
- posting_frequency: Estimated posts per week.`,
            response_json_schema: {
              type: 'object',
              properties: {
                brand_score: { type: 'number' },
                engagement: { type: 'number' },
                audience_growth: { type: 'number' },
                content_quality: { type: 'number' },
                consistency: { type: 'number' },
                niche: { type: 'string' },
                strategy: { type: 'string' },
                strengths: { type: 'array', items: { type: 'string' } },
                weaknesses: { type: 'array', items: { type: 'string' } },
                how_to_beat: { type: 'array', items: { type: 'string' } },
                top_content_types: { type: 'array', items: { type: 'string' } },
                posting_frequency: { type: 'string' },
              },
            },
          });
          return { handle, ...res };
        })
      );
      setAnalysisData(results);
    } catch (err) {
      setError('Analysis failed — check your connection and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const radarData = analysisData ? METRICS.map((metric, mi) => {
    const row = { metric };
    const keys = ['brand_score', 'engagement', 'audience_growth', 'content_quality', 'consistency'];
    analysisData.forEach((d) => {
      row[getDisplayName(d.handle)] = d[keys[mi]] || 50;
    });
    return row;
  }) : [];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-foreground neon-text">Competitor Analysis</h1>
            <p className="text-sm text-muted-foreground">See how others in your niche stack up — and how to outperform them</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 neon-border mt-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-1">Add competitors</p>
          <p className="text-xs text-muted-foreground mb-3">
            Enter their @handle or profile URL (up to {maxHandles})
            {!isPro && <span className="text-primary"> · Upgrade to Pro for up to 5</span>}
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="e.g. @garyvee or https://instagram.com/garyvee"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHandle()}
              className="h-10"
            />
            <Button onClick={addHandle} variant="outline" size="icon" className="flex-shrink-0" disabled={handles.length >= maxHandles}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {handles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {handles.map((h, i) => (
                <Badge key={h} variant="secondary" className="gap-2 py-1 px-3 text-sm">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  @{getDisplayName(h)}
                  <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors" onClick={() => removeHandle(h)} />
                </Badge>
              ))}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg p-3 mb-4">
              {error}
              {!isPro && error.includes('Upgrade') && (
                <Link to="/pricing" className="block mt-2">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Zap className="w-3 h-3" /> Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          )}

          <Button onClick={runAnalysis} disabled={loading || handles.length === 0} className="gap-2 neon-glow">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing {handles.length} competitor{handles.length > 1 ? 's' : ''}...</>
            ) : (
              <><Search className="w-4 h-4" /> {analysisData ? 'Re-analyze' : 'Run Competitor Analysis'}</>
            )}
          </Button>
        </div>

        {!analysisData && !loading && handles.length === 0 && (
          <div className="glass-card rounded-2xl p-10 neon-border text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart2 className="w-7 h-7 text-primary/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No competitors added yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Add competitor handles above to get AI-powered insights on their strategy, strengths, weaknesses, and how to outperform them.
            </p>
          </div>
        )}

        {loading && (
          <div className="glass-card rounded-2xl p-10 neon-border text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="w-12 h-12 mx-auto mb-4">
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
            <p className="text-foreground font-semibold">Analyzing competitors...</p>
            <p className="text-sm text-muted-foreground mt-1">This takes about 15-30 seconds</p>
          </div>
        )}

        {analysisData && !loading && (
          <>
            <div className="glass-card rounded-2xl p-6 neon-border mb-6">
              <h2 className="font-display font-bold text-foreground mb-1">Head-to-Head Comparison</h2>
              <p className="text-xs text-muted-foreground mb-4">Scores out of 100 across 5 key brand metrics</p>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  {analysisData.map((d, i) => (
                    <Radar
                      key={d.handle}
                      name={d.handle}
                      dataKey={getDisplayName(d.handle)}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {analysisData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    @{getDisplayName(d.handle)}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 mb-6">
              {analysisData.map((d, i) => (
                <CompetitorCard key={d.handle} data={d} color={COLORS[i % COLORS.length]} index={i} />
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 neon-border overflow-x-auto">
              <h2 className="font-display font-bold text-foreground mb-1">Quick Comparison</h2>
              <p className="text-xs text-muted-foreground mb-4">Side-by-side scores with performance labels</p>
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 pr-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide w-[140px]">Competitor</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Brand</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Engage</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Growth</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Content</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Consist.</th>
                    <th className="text-center py-2 px-1 text-xs text-muted-foreground font-semibold uppercase tracking-wide w-[80px]">Posts/Wk</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.map((d, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                          <span className="font-semibold text-foreground truncate text-xs">@{getDisplayName(d.handle)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-1"><div className="flex justify-center"><ScoreBadge score={d.brand_score} /></div></td>
                      <td className="py-3 px-1"><div className="flex justify-center"><ScoreBadge score={d.engagement} /></div></td>
                      <td className="py-3 px-1"><div className="flex justify-center"><ScoreBadge score={d.audience_growth} /></div></td>
                      <td className="py-3 px-1"><div className="flex justify-center"><ScoreBadge score={d.content_quality} /></div></td>
                      <td className="py-3 px-1"><div className="flex justify-center"><ScoreBadge score={d.consistency} /></div></td>
                      <td className="py-3 px-1 text-center text-muted-foreground text-xs">{d.posting_frequency || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
