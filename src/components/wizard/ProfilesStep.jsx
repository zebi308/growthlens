import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const platforms = [
  { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle', pattern: /^https?:\/\/(www\.)?instagram\.com\// },
  { key: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@yourhandle', pattern: /^https?:\/\/(www\.)?tiktok\.com\// },
  { key: 'youtube_url', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel', pattern: /^https?:\/\/(www\.)?youtube\.com\// },
  { key: 'twitter_url', label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle or https://x.com/yourhandle', pattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\// },
  { key: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname', pattern: /^https?:\/\/(www\.)?linkedin\.com\// },
  { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/yourpage', pattern: /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\// },
];

function validateUrl(value, pattern) {
  if (!value || value.trim() === '') return null; // empty is OK
  return pattern.test(value.trim()) ? null : 'invalid';
}

export default function ProfilesStep({ data, onChange }) {
  const [touched, setTouched] = useState({});

  const handleChange = (key, value) => {
    onChange(key, value);
  };

  const handleBlur = (key) => {
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const getError = (platform) => {
    const value = data[platform.key];
    if (!touched[platform.key]) return null;
    if (!value || value.trim() === '') return null;
    const valid = platform.pattern.test(value.trim());
    if (!valid) return `Please enter a valid ${platform.label} URL`;
    return null;
  };

  const filledCount = platforms.filter(p => data[p.key]?.trim()).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Your Social Profiles</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your social media links so the AI can analyze your brand presence across all platforms. Add at least one to continue.
        </p>
      </div>

      {platforms.map(p => {
        const error = getError(p);
        return (
          <div key={p.key} className="space-y-1.5">
            <Label className="text-sm font-medium">{p.label}</Label>
            <Input
              placeholder={p.placeholder}
              value={data[p.key] || ''}
              onChange={e => handleChange(p.key, e.target.value)}
              onBlur={() => handleBlur(p.key)}
              className={`h-11 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {error && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );
      })}

      {filledCount === 0 && touched && Object.keys(touched).length > 0 && (
        <p className="text-xs text-amber-500">Add at least one platform link to run an analysis</p>
      )}
    </div>
  );
}

// Export validation helper for use in NewAnalysis
export function hasValidUrls(data) {
  const platformConfigs = [
    { key: 'instagram_url', pattern: /^https?:\/\/(www\.)?instagram\.com\// },
    { key: 'tiktok_url', pattern: /^https?:\/\/(www\.)?tiktok\.com\// },
    { key: 'youtube_url', pattern: /^https?:\/\/(www\.)?youtube\.com\// },
    { key: 'twitter_url', pattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\// },
    { key: 'linkedin_url', pattern: /^https?:\/\/(www\.)?linkedin\.com\// },
    { key: 'facebook_url', pattern: /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\// },
  ];

  let hasAtLeastOne = false;
  for (const p of platformConfigs) {
    const val = data[p.key]?.trim();
    if (!val) continue;
    if (!p.pattern.test(val)) return false; // invalid URL
    hasAtLeastOne = true;
  }
  return hasAtLeastOne;
}
