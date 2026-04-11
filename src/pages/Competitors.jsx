import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Plus, Trash2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';

const COLORS = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];

const METRICS = ['Brand Score', 'Engagement', 'Audience Growth', 'Content Quality', 'Consistency'];

function generateMockData(handle) {
  const seed = handle.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return METRICS.map(m => ({ metric: m, value: 30 + ((seed * METRICS.indexOf(m) * 7) % 60) }));
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-foreground font-semibold">{payload[0]?.payload?.metric}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
}

export default function Competitors() {
  const [handles, setHandles] = useState(['@yourcompetitor']);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  const addHandle = () => {
    const h = input.trim();
    if (!h || handles.includes(h)) return;
    setHandles(prev => [...prev, h]);
    setInput('');
  };

  const removeHandle = (h) => setHandles(prev => prev.filter(x => x !== h));

  const runAnalysis = async () => {
    setLoading(true);
    const results = await Promise.all(
      handles.map(async (handle) => {
        const res = await appClient.integrations.Core.InvokeLLM({
          prompt: `Analyze the public social media brand presence of "${handle}". 
IMPORTANT: Do NOT invent or estimate follower counts — set followers to null since you cannot access real-time Instagram data.
Return scores 0-100 (based on observable brand signals) for: Brand Score, Engagement, Audience Growth, Content Quality, Consistency.
Return a one-line niche description. Never fabricate follower numbers.`,
          response_json_schema: {
            type: 'object',
            properties: {
              brand_score: { type: 'number' },
              engagement: { type: 'number' },
              audience_growth: { type: 'number' },
              content_quality: { type: 'number' },
              consistency: { type: 'number' },
              followers: { type: ['string', 'null'] },
              niche: { type: 'string' },
            },
          },
        });
        return { handle, ...res, followers: null }; // always null — live data not available
      })
    );
    setAnalysisData(results);
    setLoading(false);
  };

  const radarData = METRICS.map((metric, mi) => {
    const row = { metric };
    (analysisData || []).forEach((d, i) => {
      const keys = ['brand_score', 'engagement', 'audience_growth', 'content_quality', 'consistency'];
      row[d.handle] = d[keys[mi]] || 50;
    });
    return row;
  });

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-black text-foreground neon-text">Competitor Analysis</h1>
            <p className="text-sm text-muted-foreground">Compare your brand against competitors</p>
          </div>
        </div>

        {/* Input */}
        <div className="glass-card rounded-2xl p-6 neon-border mt-6 mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">Add competitor handles</p>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="@handle or profile URL"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addHandle()}
              className="h-10"
            />
            <Button onClick={addHandle} variant="outline" size="icon" className="flex-shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {handles.map(h => (
              <Badge key={h} variant="secondary" className="gap-2 py-1 px-3 text-sm">
                {h}
                <Trash2 className="w-3 h-3 cursor-pointer hover:text-red-400 transition-colors" onClick={() => removeHandle(h)} />
              </Badge>
            ))}
          </div>
          <Button onClick={runAnalysis} disabled={loading || handles.length === 0} className="gap-2 neon-glow">
            {loading ? 'Analyzing...' : 'Run Competitor Analysis'}
          </Button>
        </div>

        {/* Radar Chart */}
        {(analysisData || handles.length > 0) && (
          <div className="glass-card rounded-2xl p-6 neon-border mb-6">
            <h2 className="font-display font-bold text-foreground mb-4">Radar Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                {(analysisData || handles).map((d, i) => (
                  <Radar
                    key={analysisData ? d.handle : d}
                    name={analysisData ? d.handle : d}
                    dataKey={analysisData ? d.handle : d}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {(analysisData || handles).map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {analysisData ? d.handle : d}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        {analysisData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6 neon-border overflow-x-auto">
            <h2 className="font-display font-bold text-foreground mb-4">Detailed Metrics</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-4 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Handle</th>
                  <th className="text-right py-2 px-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Brand</th>
                  <th className="text-right py-2 px-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Engage</th>
                  <th className="text-right py-2 px-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Growth</th>
                  <th className="text-right py-2 px-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Content</th>
                  <th className="text-right py-2 px-2 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Followers</th>
                  <th className="text-left py-2 pl-4 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Niche</th>
                </tr>
              </thead>
              <tbody>
                {analysisData.map((d, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 font-semibold" style={{ color: COLORS[i % COLORS.length] }}>{d.handle}</td>
                    <td className="py-3 px-2 text-right text-foreground">{d.brand_score}</td>
                    <td className="py-3 px-2 text-right text-foreground">{d.engagement}</td>
                    <td className="py-3 px-2 text-right text-foreground">{d.audience_growth}</td>
                    <td className="py-3 px-2 text-right text-foreground">{d.content_quality}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">
                      <span className="text-xs">{d.followers || 'N/A'}</span>
                      {!d.followers && <span className="block text-[10px] text-muted-foreground/60">verify manually</span>}
                    </td>
                    <td className="py-3 pl-4 text-muted-foreground text-xs">{d.niche}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}