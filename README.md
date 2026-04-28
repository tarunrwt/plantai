<div align="center">

# 🌿 PlantAI

### AI-Powered Plant Disease Detection Platform

Instantly diagnose plant diseases from a single leaf photo. Get disease classification, severity ratings, and actionable treatment steps — powered by a MobileNetV2 CNN trained on 38 disease classes.

**[🔗 Live Demo](https://plantai-lovat.vercel.app)** · **[📖 Documentation](#-getting-started)** · **[🐛 Report Bug](https://github.com/tarunrwt/plantai/issues)** · **[✨ Request Feature](https://github.com/tarunrwt/plantai/issues)**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-005CED?logo=onnx&logoColor=white)](https://onnxruntime.ai)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **AI Disease Detection** | Upload a leaf photo → get instant classification across **38 disease classes** using MobileNetV2 CNN |
| 📊 **Severity Assessment** | Automatic severity rating (Low / Medium / High / Critical) based on confidence and disease type |
| 💊 **Treatment Guidance** | Disease-specific, actionable treatment steps curated by agronomic research |
| 📈 **Analytics Dashboard** | Interactive charts tracking disease trends, scan frequency, and crop health metrics |
| 📋 **Scan History** | Full history with search, filters, and detailed scan review in a slide-out drawer |
| 🔗 **Shareable Reports** | Generate public links to share diagnostic reports with agronomists or team members |
| 📱 **Mobile-First Design** | Dark-themed PWA-ready interface optimized for field use on any device |
| 🔐 **Auth & User Management** | Email/password + Google OAuth via Supabase with Row Level Security |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│                   Next.js 16 + React 19 + Tailwind 4           │
│           Framer Motion · Recharts · Lucide Icons              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ same-origin (no CORS)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL (Edge + Serverless)                  │
│                                                                 │
│  /app/*          → Authenticated pages (analyze, dashboard)     │
│  /api/predict    → Proxy route (forwards to Render API)         │
│  /auth/callback  → Supabase OAuth callback                      │
│  /share/[token]  → Public report viewer                         │
└───────────────────────────┬─────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────┐          ┌──────────────────────────────┐
│   Supabase Cloud     │          │   Render (Free Tier)         │
│                      │          │                              │
│  PostgreSQL + RLS    │          │  FastAPI + ONNX Runtime      │
│  Auth (Email/OAuth)  │          │  MobileNetV2 CNN (9MB)       │
│  Storage (images)    │          │  38 disease classes          │
│  Realtime            │          │  ~150MB total memory         │
└──────────────────────┘          └──────────────────────────────┘
```

## 🧠 AI Model

| Property | Value |
|---|---|
| **Architecture** | MobileNetV2 (1.0, 224×224) |
| **Base Model** | `google/mobilenet_v2_1.0_224` |
| **Fine-tuned On** | [PlantVillage Dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset) (54,306 images) |
| **Classes** | 38 (14 crop species, 26 diseases + 12 healthy) |
| **Inference Engine** | ONNX Runtime (9MB model vs 500MB PyTorch) |
| **Accuracy** | ~97% on validation set |

<details>
<summary><b>Supported Crops & Diseases (38 classes)</b></summary>

| Crop | Diseases |
|---|---|
| 🍎 Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| 🫐 Blueberry | Healthy |
| 🍒 Cherry | Powdery Mildew, Healthy |
| 🌽 Corn | Cercospora Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| 🍇 Grape | Black Rot, Esca (Black Measles), Leaf Blight, Healthy |
| 🍊 Orange | Haunglongbing (Citrus Greening) |
| 🍑 Peach | Bacterial Spot, Healthy |
| 🫑 Pepper | Bacterial Spot, Healthy |
| 🥔 Potato | Early Blight, Late Blight, Healthy |
| 🍓 Raspberry | Healthy |
| 🫘 Soybean | Healthy |
| 🍓 Strawberry | Leaf Scorch, Healthy |
| 🍅 Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Mosaic Virus, Yellow Leaf Curl Virus, Healthy |

</details>

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ (for API service)
- **Supabase** account ([free tier](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/tarunrwt/plantai.git
cd plantai
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
```

### 3. Database Setup

1. Go to your [Supabase Dashboard](https://app.supabase.com) → SQL Editor
2. Paste and run the contents of `supabase/schema.sql`
3. Enable **Google OAuth** in Authentication → Providers (optional)

### 4. API Service Setup

```bash
cd fastapi

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies (~100MB total, no PyTorch needed)
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload --port 8000
```

### 5. Start Development

```bash
# From project root
npm run dev
```

Visit **http://localhost:3000** — upload a leaf photo and watch the AI work! 🌿

## 📁 Project Structure

```
plantai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/predict/        # API proxy route (→ Render)
│   │   ├── app/                # Authenticated pages
│   │   │   ├── analyze/        # 📸 Core AI scan flow
│   │   │   ├── dashboard/      # 📊 Analytics & charts
│   │   │   ├── history/        # 📋 Scan history + drawer
│   │   │   ├── profile/        # 👤 User profile
│   │   │   ├── settings/       # ⚙️ Account settings
│   │   │   └── welcome/        # 👋 Onboarding flow
│   │   ├── auth/callback/      # OAuth callback handler
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── forgot-password/    # Password recovery
│   │   ├── reset-password/     # Password reset
│   │   └── share/[token]/      # Public scan report
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Supabase clients & utilities
│   └── types/                  # TypeScript definitions
├── fastapi/                    # Python AI prediction service
│   ├── main.py                 # FastAPI endpoints
│   ├── model.py                # ONNX Runtime model loader
│   ├── treatment_map.py        # 38-class treatment database
│   ├── onnx_model/             # Pre-exported ONNX model (9MB)
│   │   ├── model.onnx          # Model graph
│   │   ├── model.onnx.data     # Model weights
│   │   ├── labels.json         # 38 class labels
│   │   └── processor_config.json
│   ├── requirements.txt        # Lightweight deps (no PyTorch)
│   └── Dockerfile              # Production container
├── supabase/
│   └── schema.sql              # Database schema + RLS policies
├── render.yaml                 # Render deployment config
├── export_model.py             # One-time ONNX export script
└── public/
    └── manifest.json           # PWA manifest
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server components, API routes, SSR |
| **Language** | TypeScript 5 | Type-safe frontend development |
| **UI** | React 19 + Tailwind CSS 4 | Component library + utility-first styling |
| **Animation** | Framer Motion | Smooth page transitions & micro-interactions |
| **Charts** | Recharts | Interactive dashboard visualizations |
| **Icons** | Lucide React | Consistent, tree-shakeable icon set |
| **Auth & DB** | Supabase | PostgreSQL + Auth + Storage + RLS |
| **AI Engine** | ONNX Runtime | Lightweight model inference (50MB vs 500MB) |
| **CNN Model** | MobileNetV2 | Image classification (224×224 input) |
| **API** | FastAPI | High-performance Python API framework |
| **Frontend Host** | Vercel | Edge network + serverless functions |
| **API Host** | Render | Free-tier Python service hosting |

## 🚢 Deployment

### Frontend → Vercel

1. Import the GitHub repo in [Vercel Dashboard](https://vercel.com/new)
2. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_FASTAPI_URL`)
3. Deploy — auto-deploys on every push to `master`

### API → Render

1. Create a new **Web Service** in [Render Dashboard](https://dashboard.render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `fastapi`
4. **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Set **Python Version** to `3.11.9` in environment variables

> **Note**: The ONNX-based model uses only ~150MB RAM, well within Render's free-tier 512MB limit.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org):

| Prefix | Purpose |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `style:` | Formatting (no code change) |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvement |
| `test:` | Adding tests |
| `chore:` | Build/tooling changes |

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PlantVillage Dataset](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset) — Training data
- [HuggingFace](https://huggingface.co/ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease) — Pre-trained model
- [ONNX Runtime](https://onnxruntime.ai) — Lightweight inference engine
- [Supabase](https://supabase.com) — Backend-as-a-service
- [Vercel](https://vercel.com) — Frontend deployment platform

---

<div align="center">

**Built with ❤️ for farmers and agronomists worldwide**

[⬆ Back to Top](#-plantai)

</div>
