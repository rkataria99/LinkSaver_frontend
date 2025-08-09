# Link Saver — Frontend (Vite + React)

A minimal bookmark manager UI with:
- **Tag filtering**
- **Drag-and-drop ordering**
- **AI-powered link summaries** (via Jina Reader API)
- **Light/Dark theme toggle**
- **JWT authentication**

## Tech Stack
- **React + Vite**
- **Tailwind CSS** for styling and theming
- **@dnd-kit** for drag & drop
- **Axios** (via a preconfigured client in `src/api.js`)
- **React Router**
- **Jina Reader API** (used to fetch AI-generated summaries of bookmarked links)

## Quick Start (Local)

```bash
# 1) Install dependencies
npm install

# 2) Set environment
cp .env.example .env
# Edit .env and set your backend URL, e.g.:
# VITE_API_URL=http://localhost:5000/api

# 3) Run dev server
npm run dev
# open http://localhost:5173
