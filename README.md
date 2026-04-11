# Brand_AI

Supabase-backed BrandAI app.

This repository is now independent from Base44 and uses Supabase for auth, data, and server-side LLM invocation.

## Current Implementation

- Frontend: React + Vite
- Backend integration: Supabase JavaScript client via supabaseClient.js
- App backend adapter: appClient.js
- Auth state and route gating: AuthContext.jsx
- Database schema and RLS policies: schema.sql
- LLM Edge Function (OpenAI or Gemini): index.ts

## Prerequisites

- Node.js 20 or later
- npm
- A Supabase project
- Optional but recommended: Supabase CLI

## Environment Setup

Create .env.local in the project root with:

VITE_SUPABASE_URL=your_supabase_project_url  
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
VITE_SUPABASE_LLM_FUNCTION_NAME=invoke-llm

Optional variables:

VITE_AUTH_REDIRECT_URL=https://your-auth-app.example.com/login  
VITE_REQUIRE_REGISTERED_PROFILE=true

Notes:
- If VITE_REQUIRE_REGISTERED_PROFILE is true, the signed-in user must have a row in profiles.
- VITE_SUPABASE_LLM_FUNCTION_NAME defaults to invoke-llm in code, but keeping it explicit is recommended.

## Supabase Setup

1. Create a Supabase project.
2. In Supabase dashboard, copy:
- Project URL
- anon public key
3. Put those values into .env.local.
4. Apply database schema:
- Use SQL Editor and run schema.sql
- Or with CLI, run: supabase db push
5. Deploy Edge Function from index.ts
- Example CLI: supabase functions deploy invoke-llm
6. Set Edge Function secrets (choose one or both providers):
- OPENAI_API_KEY
- OPENAI_MODEL (optional, default gpt-4.1-mini)
- GEMINI_API_KEY
- GEMINI_MODEL (optional, default gemini-1.5-flash)
- LLM_PROVIDER (optional, openai or gemini; default openai)
7. Ensure Supabase Auth is enabled for your sign-in method.
8. If profile gating is enabled, insert a profile row matching auth.users.id.

## Install and Run Locally

1. Install dependencies:
npm install

2. Start development server:
npm run dev

3. Open the URL shown by Vite (typically http://localhost:5173).

## Available Scripts

- npm run dev
- npm run build
- npm run preview
- npm run lint
- npm run lint:fix
- npm run typecheck

## Troubleshooting

- Missing Supabase env vars:
Check .env.local and restart dev server.
- Auth redirects unexpectedly:
Verify VITE_AUTH_REDIRECT_URL and Supabase auth configuration.
- User not registered error:
Either disable VITE_REQUIRE_REGISTERED_PROFILE or add a profile record.
- LLM invocation failed:
Verify Edge Function is deployed and secrets are set correctly.
- Empty dashboard/results:
Confirm brand_analyses table exists and RLS policies from schema.sql were applied.
