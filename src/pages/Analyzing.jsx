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

  const runAnalysis = async () => {
    const analysis = await appClient.entities.BrandAnalysis.list();
    const record = analysis.find(a => a.id === id);
    if (!record) return;

    const platforms = [];
    if (record.instagram_url) platforms.push(`Instagram (PRIMARY): ${record.instagram_url}`);
    if (record.tiktok_url) platforms.push(`TikTok: ${record.tiktok_url}`);
    if (record.youtube_url) platforms.push(`YouTube: ${record.youtube_url}`);
    if (record.twitter_url) platforms.push(`Twitter/X: ${record.twitter_url}`);
    if (record.linkedin_url) platforms.push(`LinkedIn: ${record.linkedin_url}`);
    if (record.facebook_url) platforms.push(`Facebook: ${record.facebook_url}`);

    const context = `Platforms: ${platforms.join(', ')}. Industry: ${record.industry}. Goals: ${(record.goals || []).join(', ')}.${record.existing_content ? ` Content sample: ${record.existing_content.slice(0, 300)}` : ''}`;

    // Call 1: Core brand analysis + calendar
    const coreResult = await appClient.integrations.Core.InvokeLLM({
      prompt: `You are an Instagram-first brand consultant. Analyze this personal brand and return structured data.

${context}

Return:
- Grades (A/B/C/D/F) for overall, content quality, engagement, networking, industry alignment. Be realistic — most are C or D.
- brand_summary: 2-3 sentence paragraph on their Instagram potential.
- strengths: 3-4 specific strengths.
- weaknesses: 3-4 specific weaknesses with Instagram improvement tips.
- recommendations: 8 actionable items (categories: content, engagement, networking, seo_keywords, posting_schedule). Include Reels strategy, carousel advice, Story CTAs.
- content_calendar: 14 posts. Each has day, platform, post_type (Reel/Carousel/Static Post/Story), topic, caption (2-3 sentences), hashtags, cta, best_time, engagement_prediction (e.g. "Est. 3-5% engagement").
- networking_opportunities: 5 entries with type, name, description.`,
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

    // Call 2: Trends + influencers (separate to keep schemas small)
    const extrasResult = await appClient.integrations.Core.InvokeLLM({
      prompt: `You are a social media trend analyst. For this creator, suggest trending content and collab partners.

${context}
Current month: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.

Return:
- trend_predictions: 3 hot topics in this niche for the next 7 days (topic, platform, why it's trending, content_idea).
- influencer_suggestions: 3 creators to collaborate with (name, platform, niche, why_collab, profile_url if known).`,
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

    await appClient.entities.BrandAnalysis.update(id, {
      ...coreResult,
      ...extrasResult,
      status: 'completed',
    });

    navigate(`/results?id=${id}`);
  };

  const CurrentIcon = stages[stageIdx].icon;

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