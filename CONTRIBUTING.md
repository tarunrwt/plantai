# Contributing to PlantAI

Thank you for your interest in contributing to PlantAI! This guide will help you get started.

## 🚀 Quick Start

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/plantai.git
   cd plantai
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Make** your changes and test them
6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org):
   ```bash
   git commit -m "feat: add leaf zoom on analyze page"
   ```
7. **Push** and open a Pull Request

## 📋 Development Setup

### Frontend

```bash
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
```

### API Service

```bash
cd fastapi
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## 🏛️ Code Guidelines

- **TypeScript** — Use strict types, avoid `any`
- **Components** — Keep components focused and under 200 lines
- **Naming** — PascalCase for components, camelCase for functions/variables
- **CSS** — Use Tailwind utility classes, avoid custom CSS unless necessary
- **Commits** — Follow Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)

## 🐛 Reporting Issues

When reporting bugs, please include:

1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and OS information
4. Screenshots (if applicable)
5. Console errors (if any)

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check existing issues to avoid duplicates
2. Describe the use case clearly
3. Explain why this would benefit farmers/users

## 📝 Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Update documentation if needed
- Ensure the build passes (`npm run build`)
- Add a clear description of what changed and why

---

Thank you for helping make PlantAI better for farmers worldwide! 🌿
