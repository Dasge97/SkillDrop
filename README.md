<div align="center">

<img src="assets/1.png" alt="SkillDrop mascot" width="170" />

# SkillDrop

### A mastery-based learning platform for hands-on, mentor-evaluated courses.

**🌐 English · [Español](README.es.md)**

[![Made with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-⚡-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-%E2%89%A520-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<em>"Don't advance because you finished the lessons. Advance because you can prove mastery."</em>

</div>

---

## 🎯 What is SkillDrop?

**SkillDrop** is not another tutorial library. It's a **platform for mastery-based courses** — a guided professional training environment where every lesson runs the loop a senior mentor would run with you:

> **Mini-theory → Realistic challenge → Submission → Mentor evaluation (rubric) → Retry**

And you **don't move forward until you can prove you've mastered the phase**. No skipping. No fluff.

The platform is **course-agnostic by design** (multi-course architecture). Its flagship first course is a **complete Figma, UI/UX & Product Design bootcamp** that takes you from zero to a *"digital product designer with a frontend mindset"* — and more courses will join the catalog over time.

<div align="center">
<img src="assets/4.png" width="120" alt="working"/>&nbsp;&nbsp;&nbsp;
<img src="assets/7.png" width="120" alt="explaining"/>&nbsp;&nbsp;&nbsp;
<img src="assets/3.png" width="120" alt="celebrating"/>
</div>

---

## ✨ Features

- 🗺️ **Visual roadmap** — 13 phases (0 → 12) with locked / available / in‑progress / in‑review / completed states.
- 📚 **Structured lessons** — concise theory, key concepts, the exact Figma tools used, and a real brief.
- 🎯 **Realistic challenges** — professional briefs with constraints, deliverables, checklists and common mistakes.
- 🧑‍🏫 **Mentor evaluation** — submissions are scored 1–10 per rubric criterion, with feedback and required improvements.
- 🔒 **Mastery gating** — advance only with an average ≥ 8 and no critical criterion below 7 (spec §8).
- 📈 **Skill tree & progress** — unlockable skills, XP, levels, streaks and strengths/weaknesses.
- 🔁 **Versioned retries** — every resubmission is kept so you can compare your before/after.
- 🌗 **Premium UI** — clean, modern, light & dark mode. Inspired by Linear, Notion, Stripe and Figma.

---

## 🤖 Meet the mascot

SkillDrop is guided by a friendly **vending machine** that dispenses skills instead of snacks. It reacts to where you are in your journey:

| | Pose | Shows up when… |
|---|---|---|
| <img src="assets/2.png" width="64"/> | Winking | You log in |
| <img src="assets/6.png" width="64"/> | Bright idea | Reading the mini‑theory |
| <img src="assets/4.png" width="64"/> | Pencil & sketches | Working on a challenge |
| <img src="assets/5.png" width="64"/> | Laptop & docs | Submitting your work |
| <img src="assets/3.png" width="64"/> | Arms up | Your submission is approved |
| <img src="assets/8.png" width="64"/> | Megaphone & medal | You earn medals & streaks |

---

## 🧱 Tech stack

| Layer | Tech |
|---|---|
| **Frontend** | React + Vite + TypeScript, Tailwind CSS, React Router, TanStack Query |
| **Backend** | Node + Express + TypeScript |
| **Database** | Prisma ORM + SQLite (swap to Postgres by changing the datasource) |
| **Auth** | JWT + bcrypt, role-based (`STUDENT` · `MENTOR` · `ADMIN`) |
| **Shared** | Zod schemas & TypeScript types shared across web + api |
| **Monorepo** | npm workspaces |

---

## 🚀 Getting started

> Requires **Node ≥ 20** and **npm**.

```bash
# 1. Install all workspaces
npm install

# 2. Set up the database (SQLite) and apply migrations
npm run db:migrate

# 3. Seed the full Figma bootcamp (13 phases) + demo users
npm run db:seed

# 4. Run API + Web together
npm run dev
```

- **Web:** http://localhost:5173
- **API:** http://localhost:4000

### Demo accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| 🎓 Student | `student@skilldrop.dev` | `skilldrop` |
| 🧑‍🏫 Mentor | `mentor@skilldrop.dev` | `skilldrop` |

---

## 🐳 Run with Docker

The whole platform runs via Docker Compose as a **single public service** (`web`/nginx)
that serves the SPA and reverse-proxies `/api` to the internal `api` service. The API
auto-applies migrations and seeds the full course on first boot (SQLite persisted in a volume).

```bash
JWT_SECRET=my-secret docker compose up --build
```

- **App:** http://localhost:8080 (the API is reached at `/api`, not published separately)

See [README_DEPLOY.md](README_DEPLOY.md) for production deployment (CodeHive / Traefik).

---

## 🗂️ Project structure

```
skilldrop/
├── apps/
│   ├── api/        # Express + Prisma + SQLite (REST API, auth, progress engine)
│   └── web/        # Vite + React + Tailwind (the platform UI)
├── packages/
│   └── shared/     # Zod schemas + shared TypeScript types
├── assets/         # Mascot artwork
└── spec.md         # Full product specification
```

---

## 🧭 First course — Figma Bootcamp (13 phases)

> The first course on the platform. More courses will be added to the catalog over time.

`0` Mindset & setup · `1` Visual control · `2` Figma essentials · `3` Real UI · `4` Practical UX · `5` Responsive · `6` Components · `7` Variables & design systems · `8` Prototyping · `9` Advanced product · `10` Handoff & Dev Mode · `11` AI & workflows · `12` Portfolio & freelancing

---

## 🛣️ Roadmap

- [x] MVP: full course content, mentor evaluation, mastery gating
- [ ] Multi-course catalog & enrollment
- [ ] AI-assisted first-pass feedback
- [ ] Figma API integration (import previews)
- [ ] Community & weekly challenges
- [ ] Certificates & public portfolio builder

---

## 📄 License

Released under the [MIT License](LICENSE).

<div align="center">
<br/>
<img src="assets/3.png" width="90"/>
<br/>
<sub>Built with care. Learn by doing. Prove your mastery.</sub>
</div>
