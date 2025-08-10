# Print Sales Tracker

A simple React + Vite app to track 3D print sales, costs (auto-split COGS), expenses, and profitability with Recharts visuals.

## Run locally
```bash
npm i
npm run dev
```
Open the printed URL (usually http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Create a repo and push these files.
2. If your repo name is `3d-print-sales-tracker`, set `base: '/3d-print-sales-tracker/'` in `vite.config.js` (commit the change).
3. Build locally and push `dist` to a `gh-pages` branch **or** use a GitHub Action for Pages. The simplest way:
   - Settings → Pages → Build from a GitHub Action → pick the Vite workflow template, or publish the `dist` folder manually.

Tailwind is loaded via CDN in `index.html`, so no extra config is needed.
