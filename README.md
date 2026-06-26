# Markdown Book

Markdown Book is a single-page static book workspace for writing long-form content in Markdown.

## What it does

- renders chapters, headings, tables, images, math, and code blocks
- provides a left table of contents for fast navigation
- supports browser print export for PDF output
- runs entirely as a static frontend, with no database or backend

## Tech Stack

- React
- TypeScript
- Vite
- React Markdown
- KaTeX
- Highlight.js
- Plain CSS with reusable design tokens

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Build

```bash
npm run build
```

## Deploy

The repository is set up for GitHub Pages deployment from the `main` branch through GitHub Actions.

## Print

Use the browser print dialog or the `Export PDF` button on the cover page.

