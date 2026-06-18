# Software Testing

This repository contains a Docusaurus site for software testing study materials. It is structured as a collection of exercises, sample answers, and topic pages for test design techniques such as:

- Black Box Testing
- Boundary Value Analysis
- Equivalence Class Partitioning
- Test Automation

Each exercise lives in its own folder and can include an `assets/` directory for images, diagrams, or other supporting files.

## Tech Stack

- [Docusaurus 3](https://docusaurus.io/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MDX](https://mdxjs.com/)
- [KaTeX](https://katex.org/) for math rendering
- [Prism](https://prismjs.com/) for code syntax highlighting

## Prerequisites

- Node.js 20 or newer
- npm

## Installation

Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run start
```

The site will be available at `http://localhost:3000`.

## Build

Generate the production build:

```bash
npm run build
```

The static site will be generated in the `build/` directory.

## Preview the Production Build

Serve the generated build locally:

```bash
npm run serve
```

## Project Structure

- `docs/` - chapter pages, topic pages, and exercises
- `docs/black-box-testing/` - black-box testing exercises and topics
- `docs/test-automation/` - test automation exercises and topics
- `src/` - theme overrides, shared components, and custom styles
- `static/` - static assets such as logos and social cards

Exercise pages follow this pattern:

```text
docs/<chapter>/<topic>/<exercise-id>/index.mdx
docs/<chapter>/<topic>/<exercise-id>/assets/
```

## Deploy to GitHub Pages

This project can be deployed to GitHub Pages using the built-in Docusaurus deploy command.

### 1. Update the Docusaurus config

Before deploying, update these fields in [`docusaurus.config.ts`](./docusaurus.config.ts):

- `url`
- `baseUrl`
- `organizationName`
- `projectName`

Use values that match your GitHub Pages setup:

- For a project site, `url` is your GitHub Pages domain and `baseUrl` is usually `/<repository-name>/`
- `organizationName` should be your GitHub username or organization name
- `projectName` should be your repository name

Example for a repository named `software-testing` under `your-github-user`:

```ts
url: 'https://your-github-user.github.io',
baseUrl: '/software-testing/',
organizationName: 'your-github-user',
projectName: 'software-testing',
```

### 2. Make sure the site builds locally

```bash
npm run build
```

The build output must complete successfully before deploying.

### 3. Deploy to GitHub Pages

You can deploy with SSH or without SSH.

#### Deploy with SSH

```bash
USE_SSH=true npm run deploy
```

Use this if your GitHub account is already configured for SSH access.

#### Deploy without SSH

```bash
GIT_USER=<your-github-username> npm run deploy
```

Use this if you want to deploy over HTTPS instead of SSH.

### 4. Verify the published site

After deployment, open the GitHub Pages URL and confirm:

- the homepage loads correctly
- docs pages resolve without 404s
- code blocks, math, and navigation render correctly

If the site is published under a subpath, make sure the `baseUrl` exactly matches that subpath. A wrong `baseUrl` is the most common cause of broken assets or broken navigation after deployment.

## Deploy on GitHub Actions

You can also deploy the site automatically with GitHub Actions. This is the preferred option if you want every push to the main branch to publish a fresh build.

### How it works

- GitHub Actions checks out the repository
- It installs dependencies
- It runs `npm run build`
- It publishes the generated `build/` folder to GitHub Pages

### Setup steps

1. Update `docusaurus.config.ts` with the correct `url`, `baseUrl`, `organizationName`, and `projectName`.
2. Enable GitHub Pages in the repository settings.
3. Allow GitHub Actions to deploy to Pages.
4. Add a workflow file such as `.github/workflows/deploy.yml`.

### Example workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Notes

- If your repository uses a different default branch, change `main` to that branch name.
- If you publish to a project page, `baseUrl` should include the repository name, for example `/software-testing/`.
- The workflow above publishes the static `build/` output generated by Docusaurus.

## Notes

- Math formulas are enabled through `remark-math` and `rehype-katex`.
- Code blocks use Prism syntax highlighting.
- The site is organized by chapter and topic so new exercise groups can be added without reshaping existing pages.
