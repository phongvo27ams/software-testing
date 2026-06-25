# Quiz Studio

Quiz Studio is a simple quiz web app for software testing exercises.

It supports:
- Section-based exercise browsing
- Multiple-choice questions with auto numbering
- Immediate correct / wrong feedback
- Rich content in questions and explanations:
  - Markdown text
  - Code syntax highlighting
  - Math formulas
  - Tables
  - Images
- Exercise creation and editing
- Score summary at the end of an exercise

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Plain CSS with shared design tokens
- Content rendering: Markdown, KaTeX, Highlight.js
- Backend: Node.js + Express
- Database: Prisma + SQLite

## Project Structure

- `src/` - React frontend
- `server/` - Express API
- `prisma/` - Prisma schema and seed data

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

The project uses SQLite locally through Prisma.

```bash
npx prisma generate --no-engine
npx prisma db push
npm run seed
```

### 3. Start the app

```bash
npm run dev
```

This starts both:
- the Express API
- the Vite frontend

Open the URL shown in the terminal.

## Available Scripts

- `npm run dev` - start both the frontend and backend in development
- `npm run dev:client` - start only the frontend
- `npm run dev:server` - start only the backend API
- `npm run build` - build the frontend for production
- `npm run seed` - populate the database with sample sections and exercises
- `npm run prisma:generate` - generate Prisma Client
- `npm run prisma:push` - push the Prisma schema to the local SQLite database

## Database Notes

- The local database is stored in `prisma/dev.db`
- The database file is ignored by Git
- Schema changes should be made in `prisma/schema.prisma`
- Sample data is generated through `prisma/seed.ts`

## Deployment Notes

GitHub Pages can host only the static frontend.

If you deploy to GitHub Pages:
- the React UI can be hosted there
- the Express API and SQLite database cannot run there

For a full working app with save/edit features, deploy the backend and database separately on a Node-hosting platform, then point the frontend to that API.

## License

No license has been added yet.
