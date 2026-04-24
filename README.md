# 🌿 PlantAI — AI Plant Disease Detection

> Instantly detect plant diseases with AI. Upload a leaf photo, get diagnosis with confidence score, severity rating, and actionable treatment steps.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- 🔬 **AI Diagnosis** — 38 disease classes via HuggingFace MobileNetV2
- 📊 **Severity Rating** — Low / Medium / High / Critical
- 💊 **Treatment Steps** — Actionable, disease-specific guidance
- 📈 **Dashboard** — Track disease trends with interactive charts
- 📋 **Scan History** — Filter, search, and review past scans
- 🔗 **Share Reports** — Generate public links for agronomists
- 📱 **Mobile First** — PWA-ready, designed for field use
- 🔒 **Tier Gating** — Free (10 scans/mo), Pro ($9/mo), Team ($29/mo)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI, HuggingFace Transformers, MobileNetV2 |
| Database | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Deployment | Vercel (frontend), Railway (API) |

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/plantai.git
cd plantai

# Install
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database schema
# Paste supabase/schema.sql into Supabase SQL Editor

# Start dev server
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

## Project Structure

```
plantai/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── app/              # Authenticated modules
│   │   │   ├── analyze/      # Core AI scan flow
│   │   │   ├── dashboard/    # Analytics & charts
│   │   │   ├── history/      # Scan history + drawer
│   │   │   ├── profile/      # User profile
│   │   │   ├── settings/     # Subscription & account
│   │   │   └── welcome/      # Onboarding flow
│   │   ├── auth/callback/    # OAuth callback handler
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── share/[token]/    # Public scan report
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Supabase clients & utilities
│   └── types/                # TypeScript definitions
├── fastapi/                  # Python prediction service
│   ├── main.py               # FastAPI endpoints
│   ├── model.py              # HuggingFace model loader
│   ├── treatment_map.py      # 38-class treatment database
│   └── Dockerfile            # Production container
├── supabase/
│   └── schema.sql            # Database schema + RLS
└── public/
    └── manifest.json         # PWA manifest
```

## License

MIT
