# Markdown Book

Markdown Book is a single-page static documentation workspace built like a book.

It is designed for:
- writing long-form content in Markdown
- styling pages with CSS and reusable tokens
- rendering code blocks, math formulas, tables, and images
- exporting the page to PDF through the browser print dialog

## Features

- One-page book layout with a cover page
- Sidebar table of contents for quick navigation
- Chapter content rendered from Markdown
- Heading support down to subsection level 3
- Syntax highlighting for code blocks
- Math rendering with KaTeX
- Responsive image and table rendering
- Print-friendly output for PDF export

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Plain CSS with design tokens
- Content rendering: React Markdown, KaTeX, Highlight.js
- Hosting target: static hosting such as GitHub Pages or Vercel

## Project Structure

- `src/` - React frontend and book layout
- `public/` - static assets

## Local Development

### Install dependencies

```bash
npm install
```

### Start the app

```bash
npm run dev
```

The app runs as a single page at `http://localhost:5173/`.

## Build

```bash
npm run build
```

## GitHub Pages Deploy

This repository includes a GitHub Actions workflow that deploys the static site automatically whenever you push to `main`.

What the workflow does:
- checks out the code
- installs dependencies
- builds the Vite app
- publishes the `dist/` folder to GitHub Pages

Before using GitHub Pages:
- enable GitHub Pages in the repository settings
- set the source to GitHub Actions

## Print to PDF

Use the browser print dialog:

```bash
window.print()
```

Or click the `Export PDF` button in the cover section.

The print layout hides navigation and keeps the page book-like for PDF output.

## Notes

- This project no longer includes quiz logic.
- There is no database, backend API, or external media service in the current version.
- All content is local and static.

## License

No license has been added yet.
