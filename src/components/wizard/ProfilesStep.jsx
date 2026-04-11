import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

const primaryPlatforms = [
  { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', priority: true },
  { key: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle', priority: true },
  { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', priority: true },
  { key: 'twitter_url', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle', priority: true },
];

const secondaryPlatforms = [
  { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
  { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
];

export default function ProfilesStep({ data, onChange }) {
  const [showSecondary, setShowSecondary] = useState(
    !!(data.linkedin_url || data.facebook_url)
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Your Social Profiles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your social media links so the AI can analyze your brand presence. Instagram is the primary focus.
        </p>
      </div>

      {primaryPlatforms.map(p => (
        <div key={p.key} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">{p.label}</Label>
            {p.key === 'instagram_url' && (
              <Badge className="text-[10px] bg-pink-100 text-pink-700 border-0">Primary</Badge>
            )}
          </div>
          <Input
            placeholder={p.placeholder}
            value={data[p.key] || ''}
            onChange={e => onChange(p.key, e.target.value)}
            className="h-11"
          />
        </div>
      ))}

      {/* Secondary platforms toggle */}
      <button
        type="button"
        onClick={() => setShowSecondary(v => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors pt-1"
      >
        {showSecondary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        {showSecondary ? 'Hide' : 'Add'} professional platforms (LinkedIn, Facebook)
      </button>

      {showSecondary && (
        <div className="space-y-4 border-l-2 border-border pl-4">
          {secondaryPlatforms.map(p => (
            <div key={p.key} className="space-y-1.5">
              <Label className="text-sm font-medium">{p.label}</Label>
              <Input
                placeholder={p.placeholder}
                value={data[p.key] || ''}
                onChange={e => onChange(p.key, e.target.value)}
                className="h-11"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}