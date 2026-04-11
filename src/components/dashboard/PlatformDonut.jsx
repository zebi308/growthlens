import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const PLATFORM_COLORS = {
  Instagram: '#ec4899',
  TikTok: '#a855f7',
  YouTube: '#ef4444',
  Twitter: '#38bdf8',
  LinkedIn: '#3b82f6',
  Facebook: '#6366f1',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} analyses</p>
    </div>
  );
}

export default function PlatformDonut({ analyses }) {
  const counts = {};
  analyses.forEach(a => {
    if (a.instagram_url) counts['Instagram'] = (counts['Instagram'] || 0) + 1;
    if (a.tiktok_url) counts['TikTok'] = (counts['TikTok'] || 0) + 1;
    if (a.youtube_url) counts['YouTube'] = (counts['YouTube'] || 0) + 1;
    if (a.twitter_url) counts['Twitter'] = (counts['Twitter'] || 0) + 1;
    if (a.linkedin_url) counts['LinkedIn'] = (counts['LinkedIn'] || 0) + 1;
    if (a.facebook_url) counts['Facebook'] = (counts['Facebook'] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const fallback = [
    { name: 'Instagram', value: 40 },
    { name: 'TikTok', value: 25 },
    { name: 'YouTube', value: 20 },
    { name: 'LinkedIn', value: 15 },
  ];
  const chartData = data.length > 0 ? data : fallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass-card rounded-2xl p-6 neon-border"
    >
      <h3 className="font-display font-bold text-foreground mb-1">Platform Distribution</h3>
      <p className="text-xs text-muted-foreground mb-4">Analyses by platform</p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
              dataKey="value" strokeWidth={0}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={PLATFORM_COLORS[entry.name] || '#6b7280'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {chartData.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PLATFORM_COLORS[d.name] || '#6b7280' }} />
              <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
              <span className="text-xs font-semibold text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}