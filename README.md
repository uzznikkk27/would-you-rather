# Would You Rather — Public Site

A modern, mobile-friendly "Would You Rather" site with a tiny Node/Express backend.

## Features
- Clean UI with subtle animations
- Mobile-first responsive layout
- Randomized order + next/prev navigation
- One endpoint: `/questions` loads from `questions.json` (no restart needed)
- Static assets served from `/public`
- Ready for free hosting (Render, Railway, Fly.io, VPS)

## Local Setup
```bash
npm install
npm start
# open http://localhost:3000
```

## Update Questions
Edit `questions.json`. The server re-reads it on every request, so no restart is required.

## Deploy
- **Render** (free tier):
  1. Create a new Web Service from your GitHub repo.
  2. Build command: `npm install`
  3. Start command: `npm start`
- **Railway / Fly.io / VPS**: same commands. Make sure port is exposed.

## Optional enhancements
- Add a database to store aggregate vote percentages
- Add categories + filters
- Add multi-language support
- Add admin route to push new questions securely
