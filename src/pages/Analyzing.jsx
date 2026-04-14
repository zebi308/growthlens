import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appClient } from '@/api/appClient';
import { motion } from 'framer-motion';
import { Sparkles, Globe, BarChart3, Lightbulb, Calendar } from 'lucide-react';

const stages = [
  { icon: Globe, label: 'Scanning social profiles...' },
  { icon: BarChart3, label: 'Analyzing engagement patterns...' },
  { icon: Lightbulb, label: 'Generating brand recommendations...' },
  { icon: Calendar, label: 'Building content calendar...' },
];

export default function Analyzing() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIdx(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!id) return;
    runAnalysis();
  }, [id]);

  const getUserCountry = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.startsWith('Asia/Karachi') || tz.startsWith('Asia/Islamabad')) return 'Pakistan';
      if (tz.startsWith('Europe/London') || tz.startsWith('Europe/Belfast')) return 'United Kingdom';
      if (tz.startsWith('America/New_York') || tz.startsWith('America/Chicago') || tz.startsWith('America/Denver') || tz.startsWith('America/Los_Angeles')) return 'United States';
      if (tz.startsWith('Asia/Dubai')) return 'United Arab Emirates';
      if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'India';
      if (tz.startsWith('Europe/')) return tz.split('/')[1].replace(/_/g, ' ');
      if (tz.startsWith('Asia/')) return tz.split('/')[1].replace(/_/g, ' ');
      if (tz.startsWith('Australia/')) return 'Australia';
      const lang = navigator.language || 'en';
      if (lang.includes('en-GB')) return 'United Kingdom';
      if (lang.includes('en-US')) return 'United States';
      if (lang.includes('ur')) return 'Pakistan';
      return 'the user\'s region';
    } catch {
      return 'the user\'s region';
    }
  };

  const runAnalysis = async () => {
    const analysis = await appClient.entities.BrandAnalysis.list();
    const record = analysis.find(a => a.id === id);
    if (!record) return;

    const currentUser = await appClient.auth.me();
    const isPro = currentUser?.role === 'pro' || currentUser?.role === 'admin' || currentUser?.role === 'agency';
    const userCountry = getUserCountry();

    // Collect ALL provided platforms
    const platforms = [];
    if (record.instagram_url) platforms.push(`Instagram: ${record.instagram_url}`);
    if (record.tiktok_url) platforms.push(`TikTok: ${record.tiktok_url}`);
    if (record.youtube_url) platforms.push(`YouTube: ${record.youtube_url}`);
    if (record.twitter_url) platforms.push(`Twitter/X: ${record.twitter_url}`);
    if (record.linkedin_url) platforms.push(`LinkedIn: ${record.linkedin_url}`);
    if (record.facebook_url) platforms.push(`Facebook: ${record.facebook_url}`);

    // Free users: only first platform provided
    const activePlatforms = isPro ? platforms : platforms.slice(0, 1);
    const platformNames = activePlatforms.map(p => p.split(':')[0].trim());

    const context = `Platforms provided: ${activePlatforms.join(', ')}. Industry: ${record.industry}. Goals: ${(record.goals || []).join(', ')}.${record.existing_content ? ` Content sample: ${record.existing_content.slice(0, 300)}` : ''}\nUser location: ${userCountry}.`;

    // Always generate 14 days so free users see 7 + 7 blurred
    const calendarDays = 14;
    const recommendationCount = isPro ? 8 : 6;
    const networkingCount = isPro ? 5 : 4;

    try {
    const coreResult = await appClient.integrations.Core.InvokeLLM({
      prompt: `You are a multi-platform social media brand consultant. Analyze this personal brand across ALL the platforms they provided and return structured data.

IMPORTANT: Visit and analyze the actual profile URLs provided. Base your analysis on the real content, follower count, engagement, posting frequency, and brand consistency you can observe from these profiles. Do NOT make generic assumptions — analyze what is actually there.

${context}

The user has provided ${activePlatforms.length} platform(s): ${platformNames.join(', ')}. Analyze ALL of them equally — not just Instagram. Your content calendar should include posts for ALL platforms the user provided. Recommendations should cover ALL their platforms.

Return:
- Grades (A/B/C/D/F) for overall, content quality, engagement, networking, industry alignment. Grade fairly based on actual quality signals from the provided profile URLs — A for exceptional, B for good, C for average, D for below average, F for poor. Assess each dimension independently based on what you can observe.
- brand_summary: 2-3 sentence paragraph analyzing their brand across all provided platforms.
- strengths: ${isPro ? '3-4' : '2'} specific strengths observed from their actual profiles.
- weaknesses: ${isPro ? '3-4' : '2'} specific weaknesses with improvement tips for their platforms.
- recommendations: ${recommendationCount} actionable items (categories: content, engagement, networking, seo_keywords, posting_schedule). Tailor advice to the specific platforms they use (${platformNames.join(', ')}).
- content_calendar: ${calendarDays} posts spread across the user's platforms (${platformNames.join(', ')}). Each has day, platform (must be one of the user's actual platforms), post_type (Reel/Carousel/Static Post/Story/Video/Article/Thread as appropriate for each platform), topic, caption (2-3 sentences), hashtags, cta, best_time, engagement_prediction.
- networking_opportunities: ${networkingCount} entries with type, name, description, url. Only suggest communities and groups in ${userCountry}. If none exist, suggest global online communities. Include country in description.`,
      response_json_schema: {
        type: "object",
        properties: {
          overall_grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          content_quality_grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          engagement_grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          networking_grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          alignment_grade: { type: "string", enum: ["A", "B", "C", "D", "F"] },
          brand_summary: { type: "string" },
          strengths: { type: "array", items: { type: "string" } },
          weaknesses: { type: "array", items: { type: "string" } },
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                priority: { type: "string", enum: ["high", "medium", "low"] }
              }
            }
          },
          content_calendar: {
            type: "array",
            items: {
              type: "object",
              properties: {
                day: { type: "number" },
                platform: { type: "string" },
                post_type: { type: "string" },
                topic: { type: "string" },
                caption: { type: "string" },
                hashtags: { type: "string" },
                cta: { type: "string" },
                best_time: { type: "string" },
                engagement_prediction: { type: "string" }
              }
            }
          },
          networking_opportunities: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                name: { type: "string" },
                description: { type: "string" },
                url: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Call 2: Trends + influencers (Pro only)
    let extrasResult = {};
    if (isPro) {
      extrasResult = await appClient.integrations.Core.InvokeLLM({
      prompt: `You are a social media trend analyst. For this creator active on ${platformNames.join(', ')}, suggest trending content and collab partners.

${context}
Current month: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.

Return:
- trend_predictions: 3 hot topics in this niche for the next 7 days. Include the most relevant platform for each trend from the user's platforms (${platformNames.join(', ')}). Each has: topic, platform, why, content_idea.
- influencer_suggestions: 3 creators to collaborate with. Only suggest creators based in ${userCountry}. If not enough, suggest globally recognized creators but note their country. Each has: name, platform, niche, why_collab, profile_url.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          trend_predictions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                topic: { type: "string" },
                platform: { type: "string" },
                why: { type: "string" },
                content_idea: { type: "string" }
              }
            }
          },
          influencer_suggestions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                platform: { type: "string" },
                niche: { type: "string" },
                why_collab: { type: "string" },
                profile_url: { type: "string" }
              }
            }
          }
        }
      }
    });
    }

    await appClient.entities.BrandAnalysis.update(id, {
      ...coreResult,
      ...extrasResult,
      status: 'completed',
    });

    navigate(`/dashboard/results?id=${id}`);
    } catch (err) {
      console.error('Analysis failed:', err);
      await appClient.entities.BrandAnalysis.update(id, { status: 'failed' });
      navigate(`/dashboard/results?id=${id}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
        >
          <Sparkles className="w-10 h-10 text-primary" />
        </motion.div>
      </motion.div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-2">Analyzing Your Brand</h2>
      <p className="text-muted-foreground mb-10">This usually takes about 30 seconds</p>

      <div className="space-y-3 w-full max-w-sm">
        {stages.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: i <= stageIdx ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              i <= stageIdx ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            }`}>
              <s.icon className="w-4 h-4" />
            </div>
            <span className={`text-sm font-medium ${i <= stageIdx ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s.label}
            </span>
            {i === stageIdx && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 rounded-full bg-primary ml-auto"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
