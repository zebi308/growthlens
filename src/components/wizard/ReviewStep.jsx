import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function ReviewStep({ data }) {
  const platforms = [
    { key: 'linkedin_url', label: 'LinkedIn' },
    { key: 'twitter_url', label: 'Twitter/X' },
    { key: 'instagram_url', label: 'Instagram' },
    { key: 'tiktok_url', label: 'TikTok' },
    { key: 'youtube_url', label: 'YouTube' },
  ];

  const connected = platforms.filter(p => data[p.key]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Review & Launch</h2>
        <p className="text-sm text-muted-foreground mt-1">Confirm your details before starting the AI analysis.</p>
      </div>

      <div className="space-y-4 bg-muted/50 rounded-2xl p-5">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Connected Platforms</p>
          <div className="flex flex-wrap gap-2">
            {connected.length > 0 ? connected.map(p => (
              <Badge key={p.key} variant="secondary" className="px-3 py-1">{p.label}</Badge>
            )) : <span className="text-sm text-muted-foreground">No platforms added</span>}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Industry</p>
          <p className="font-medium text-foreground">{data.industry || 'Not specified'}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Goals</p>
          <div className="flex flex-wrap gap-2">
            {(data.goals || []).map(g => (
              <Badge key={g} className="bg-primary/10 text-primary border-0 px-3 py-1">{g}</Badge>
            ))}
            {(!data.goals || data.goals.length === 0) && <span className="text-sm text-muted-foreground">No goals selected</span>}
          </div>
        </div>

        {data.existing_content && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Existing Content</p>
            <p className="text-sm text-foreground line-clamp-3">{data.existing_content}</p>
          </div>
        )}
      </div>
    </div>
  );
}