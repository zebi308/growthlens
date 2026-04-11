import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrengthsWeaknesses({ strengths = [], weaknesses = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-500" /> Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 text-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
              <span className="text-foreground">{s}</span>
            </motion.li>
          ))}
        </ul>
      </Card>
      <Card className="p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> Areas to Improve
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((w, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 text-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
              <span className="text-foreground">{w}</span>
            </motion.li>
          ))}
        </ul>
      </Card>
    </div>
  );
}