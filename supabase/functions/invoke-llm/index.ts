// Supabase Edge Function for provider-agnostic LLM invocation.
// Supports OpenAI or Gemini selected by payload/provider env.

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type JsonSchema = Record<string, unknown>;

type LlmPayload = {
  prompt: string;
  response_json_schema?: JsonSchema;
  add_context_from_internet?: boolean;
  provider?: 'openai' | 'gemini';
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callOpenAI(payload: LlmPayload) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const body: Record<string, unknown> = {
    model,
    messages: [{ role: 'user', content: payload.prompt }],
  };

  if (payload.response_json_schema) {
    body.response_format = {
      type: 'json_schema',
      json_schema: {
        name: 'brand_ai_schema',
        schema: payload.response_json_schema,
      },
    };
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`OpenAI request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI response did not include content');
  }

  try {
    return JSON.parse(content);
  } catch {
    return { raw: content };
  }
}

async function callGemini(payload: LlmPayload) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash';
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const schemaInstruction = payload.response_json_schema
    ? `\nReturn ONLY valid JSON matching this schema:\n${JSON.stringify(payload.response_json_schema)}`
    : '';

  const prompt = `${payload.prompt}${schemaInstruction}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini response did not include text');
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as LlmPayload;
    if (!payload?.prompt) {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const defaultProvider = (Deno.env.get('LLM_PROVIDER') || 'openai').toLowerCase();
    const provider = payload.provider || (defaultProvider === 'gemini' ? 'gemini' : 'openai');

    const result = provider === 'gemini'
      ? await callGemini(payload)
      : await callOpenAI(payload);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
