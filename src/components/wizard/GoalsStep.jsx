import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';

const goalOptions = [
  'Grow my audience',
  'Get freelance clients',
  'Become a thought leader',
  'Build brand awareness',
  'Drive traffic to my website',
  'Network with industry peers',
  'Launch a product or service',
  'Get speaking opportunities',
  'Attract investors',
  'Build an online community',
];

export default function GoalsStep({ data, onChange }) {
  const goals = data.goals || [];

  const toggle = (goal) => {
    const next = goals.includes(goal) ? goals.filter(g => g !== goal) : [...goals, goal];
    onChange('goals', next);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Your Goals</h2>
        <p className="text-sm text-muted-foreground mt-1">Select one or more goals for your personal brand.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {goalOptions.map(g => {
          const selected = goals.includes(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggle(g)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all duration-200 ${
                selected
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                selected ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {selected && <Check className="w-3 h-3" />}
              </div>
              {g}
            </button>
          );
        })}
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Existing Content (optional)</Label>
        <Textarea
          placeholder="Paste any existing content you'd like us to analyze (blog posts, post text, etc.)"
          value={data.existing_content || ''}
          onChange={e => onChange('existing_content', e.target.value)}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}