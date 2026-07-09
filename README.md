# Software Testing

Software Testing is a static, book-style documentation site for long-form technical writing, browser reading, and PDF export. The project now builds a single continuous book from one source file, [`book.md`](./book.md), while preserving the existing cover page, contents layout, heading numbering, syntax highlighting, mathematical formulas, callouts, and print-aware styling.

## Features

- Single-page book reading experience
- Professional cover page and print-aware PDF layout
- Auto-generated contents from document headings
- Numbered `h1`, `h2`, and `h3` headings
- Single Markdown source file: `book.md`
- Code syntax highlighting
- KaTeX math rendering
- Styled admonitions and callouts with `:::tip` / `:::warning` syntax
- Static HTML output in `dist/`
- Plain CSS book layout with browser print support

## Tech Stack

- Node.js build script
- Unified + Remark Parse
- Remark GFM
- Remark Math
- Highlight.js
- KaTeX
- Plain CSS

## Project Structure

- `book.md`
  The single content source for the whole book. Chapter boundaries are marked with `<!-- chapter -->` so the rendered layout keeps the current section spacing and print behavior.
- `scripts/build.mjs`
  Reads `book.md`, renders Markdown to HTML, generates the contents tree, numbers headings, and writes the static site to `dist/`.
- `scripts/preview.mjs`
  Small local preview server for the generated `dist/` output.
- `styles.css`
  Design tokens, layout styling, callouts, and print CSS.
- `public/`
  Optional static assets such as images or downloadable files. Everything here is copied into `dist/` on build and watched in dev mode.
- `dist/`
  Generated static site output.

## Install Dependencies

```bash
npm install
```

## Build

```bash
npm run build
```

This writes the static site to:

```text
dist/
```

## Preview

Build first, then start the local preview server:

```bash
npm run preview
```

Then open:

```text
http://localhost:4173/
```

## Editing Content

Edit [`book.md`](./book.md) directly.

- Use normal Markdown for headings, tables, lists, code blocks, and links.
- Use `$...$` and `$$...$$` for math.
- Use `:::note`, `:::tip`, `:::info`, `:::warning`, and `:::danger` for callouts.
- Use `<!-- chapter -->` between major sections when you want to preserve the current per-chapter layout and print breaks.
- Put images and other static assets in `public/`, then reference them from Markdown with root-relative paths such as `/images/example.png`.

## PDF Export

The cover page includes an `Export PDF` button that opens the browser print flow.

Recommended print settings:

- Enable `Background graphics`
- Disable browser `Headers and footers`
- Save as PDF

## Deployment

The build output is static. Deploy the contents of `dist/` to any static host, including GitHub Pages.
