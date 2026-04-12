import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const suggestions = [
  'Tech / SaaS', 'Marketing & Advertising', 'Influencer', 'Finance & Fintech', 'Healthcare',
  'Education', 'E-commerce', 'Real Estate', 'Design & Creative',
  'AI & Machine Learning', 'Coaching & Consulting', 'Media & Entertainment', 'Fitness & Wellness',
];

export default function IndustryStep({ data, onChange }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Your Industry</h2>
        <p className="text-sm text-muted-foreground mt-1">Tell us your niche so we can compare you with industry trends.</p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Industry / Niche <span className="text-primary">*</span></Label>
        <Input
          placeholder="e.g. AI & Machine Learning"
          value={data.industry || ''}
          onChange={e => onChange('industry', e.target.value)}
          className="h-11"
        />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Quick select</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestions.map(s => (
            <Badge
              key={s}
              variant={data.industry === s ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary/10 transition-colors px-3 py-1.5 text-xs"
              onClick={() => onChange('industry', s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}