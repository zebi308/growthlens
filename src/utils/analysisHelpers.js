// Extract username from a social URL
export function extractUsername(url) {
  if (!url) return null;
  const trimmed = url.trim().replace(/\/+$/, '').replace(/\?.*$/, '');
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const parts = parsed.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || '';
    return last.replace(/^@/, '') || null;
  } catch {
    return trimmed.replace(/^@/, '') || null;
  }
}

// Get all platforms + usernames from an analysis record
export function getAnalysisPlatforms(analysis) {
  const platforms = [];
  if (analysis.instagram_url) platforms.push({ name: 'Instagram', username: extractUsername(analysis.instagram_url), url: analysis.instagram_url });
  if (analysis.tiktok_url) platforms.push({ name: 'TikTok', username: extractUsername(analysis.tiktok_url), url: analysis.tiktok_url });
  if (analysis.youtube_url) platforms.push({ name: 'YouTube', username: extractUsername(analysis.youtube_url), url: analysis.youtube_url });
  if (analysis.twitter_url) platforms.push({ name: 'Twitter/X', username: extractUsername(analysis.twitter_url), url: analysis.twitter_url });
  if (analysis.linkedin_url) platforms.push({ name: 'LinkedIn', username: extractUsername(analysis.linkedin_url), url: analysis.linkedin_url });
  if (analysis.facebook_url) platforms.push({ name: 'Facebook', username: extractUsername(analysis.facebook_url), url: analysis.facebook_url });
  return platforms;
}

// Get a short display label for an analysis (username + platforms)
export function getAnalysisLabel(analysis) {
  const platforms = getAnalysisPlatforms(analysis);
  if (platforms.length === 0) return analysis.industry || 'Untitled';
  const primary = platforms[0];
  const username = primary.username || analysis.industry || 'Untitled';
  const platformNames = platforms.map(p => p.name);
  return { username: `@${username}`, platforms: platformNames };
}