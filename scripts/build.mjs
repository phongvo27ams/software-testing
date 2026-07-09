import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { icon } from '@fortawesome/fontawesome-svg-core';
import {
  faCircleExclamation,
  faCircleInfo,
  faFireFlameCurved,
  faLightbulb,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import katex from 'katex';
import hljs from 'highlight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const rootDir = path.resolve(__dirname, '..');
export const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const staticDir = path.join(rootDir, 'public');
const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath);

const calloutMeta = {
  note: { label: 'NOTE', iconDefinition: faCircleInfo },
  tip: { label: 'TIP', iconDefinition: faLightbulb },
  info: { label: 'INFO', iconDefinition: faCircleExclamation },
  warning: { label: 'WARNING', iconDefinition: faTriangleExclamation },
  danger: { label: 'DANGER', iconDefinition: faFireFlameCurved },
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueId(base, usedIds) {
  let candidate = base || 'section';
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base || 'section'}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function extractText(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode' || node.type === 'code') return node.value ?? '';
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractText).join('');
  }
  return '';
}

function addTocItem(tocRoots, tocStack, item) {
  while (tocStack.length && tocStack[tocStack.length - 1].level >= item.level) {
    tocStack.pop();
  }

  if (tocStack.length === 0) {
    tocRoots.push(item);
  } else {
    tocStack[tocStack.length - 1].children.push(item);
  }

  tocStack.push(item);
}

function numberForHeading(level, counters) {
  if (level === 1) {
    counters.h1 += 1;
    counters.h2 = 0;
    counters.h3 = 0;
    return `${counters.h1}`;
  }

  if (level === 2) {
    if (counters.h1 === 0) counters.h1 = 1;
    counters.h2 += 1;
    counters.h3 = 0;
    return `${counters.h1}.${counters.h2}`;
  }

  if (level === 3) {
    if (counters.h1 === 0) counters.h1 = 1;
    if (counters.h2 === 0) counters.h2 = 1;
    counters.h3 += 1;
    return `${counters.h1}.${counters.h2}.${counters.h3}`;
  }

  return '';
}

function splitAdmonitions(markdown) {
  const lines = markdown.split('\n');
  const segments = [];
  let buffer = [];
  let index = 0;

  while (index < lines.length) {
    const match = /^:::(note|tip|info|warning|danger)\s*$/.exec(lines[index].trim());
    if (!match) {
      buffer.push(lines[index]);
      index += 1;
      continue;
    }

    if (buffer.join('\n').trim()) {
      segments.push({ type: 'markdown', value: buffer.join('\n') });
    }
    buffer = [];

    const calloutType = match[1];
    index += 1;
    const body = [];
    while (index < lines.length && lines[index].trim() !== ':::') {
      body.push(lines[index]);
      index += 1;
    }
    if (index < lines.length) index += 1;
    segments.push({ type: 'callout', calloutType, value: body.join('\n') });
  }

  if (buffer.join('\n').trim()) {
    segments.push({ type: 'markdown', value: buffer.join('\n') });
  }

  return segments;
}

function renderInline(node, state) {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value ?? '');
    case 'strong':
      return `<strong>${renderChildren(node.children, state)}</strong>`;
    case 'emphasis':
      return `<em>${renderChildren(node.children, state)}</em>`;
    case 'delete':
      return `<del>${renderChildren(node.children, state)}</del>`;
    case 'inlineCode':
      return `<code>${escapeHtml(node.value ?? '')}</code>`;
    case 'link':
      return `<a href="${escapeHtml(node.url ?? '#')}">${renderChildren(node.children, state)}</a>`;
    case 'image':
      return `<img class="md-image" src="${escapeHtml(node.url ?? '')}" alt="${escapeHtml(node.alt ?? '')}" />`;
    case 'break':
      return '<br />';
    case 'inlineMath':
      return katex.renderToString(node.value ?? '', { throwOnError: false, displayMode: false });
    case 'html':
      return node.value ?? '';
    default:
      if (node.children) {
        return renderChildren(node.children, state);
      }
      return '';
  }
}

function renderTable(node, state) {
  const rows = node.children
    .map((row, rowIndex) => {
      const cells = row.children
        .map((cell) => {
          const tag = rowIndex === 0 ? 'th' : 'td';
          return `<${tag}>${renderChildren(cell.children, state)}</${tag}>`;
        })
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `<div class="md-table-wrap"><table class="md-table">${rows}</table></div>`;
}

function renderCodeBlock(node) {
  const language = (node.lang ?? '').trim();
  const code = node.value ?? '';
  let highlighted = escapeHtml(code);

  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(code, { language }).value;
  } else if (!language) {
    highlighted = hljs.highlightAuto(code).value;
  }

  const className = language ? `hljs language-${escapeHtml(language)}` : 'hljs';
  return `<pre class="md-pre"><code class="${className}">${highlighted}</code></pre>`;
}

function renderNode(node, state) {
  switch (node.type) {
    case 'paragraph':
      return `<p class="md-paragraph">${renderChildren(node.children, state)}</p>`;
    case 'heading': {
      const level = node.depth;
      const text = extractText(node).trim();
      const tag = `h${Math.min(level, 6)}`;
      const numberLabel = level <= 3 ? numberForHeading(level, state.counters) : '';
      const id = uniqueId(slugify(text), state.usedIds);
      if (level <= 3) {
        addTocItem(state.tocRoots, state.tocStack, {
          id,
          text,
          level,
          label: numberLabel,
          children: [],
        });
      }
      const numberMarkup = numberLabel ? `<span class="heading-number">${numberLabel}</span>` : '';
      return `<${tag} id="${id}">${numberMarkup}${renderChildren(node.children, state)}</${tag}>`;
    }
    case 'blockquote':
      return `<blockquote>${renderChildren(node.children, state)}</blockquote>`;
    case 'list': {
      const tag = node.ordered ? 'ol' : 'ul';
      const startAttr = node.ordered && node.start && node.start !== 1 ? ` start="${node.start}"` : '';
      return `<${tag}${startAttr}>${renderChildren(node.children, state)}</${tag}>`;
    }
    case 'listItem': {
      const checked = typeof node.checked === 'boolean';
      const checkbox = checked
        ? `<input type="checkbox" disabled${node.checked ? ' checked' : ''} /> `
        : '';
      return `<li>${checkbox}${renderChildren(node.children, state)}</li>`;
    }
    case 'table':
      return renderTable(node, state);
    case 'code':
      return renderCodeBlock(node);
    case 'thematicBreak':
      return '<hr />';
    case 'html':
      return node.value ?? '';
    case 'math':
      return katex.renderToString(node.value ?? '', { throwOnError: false, displayMode: true });
    default:
      return renderInline(node, state);
  }
}

function renderChildren(children = [], state) {
  return children.map((child) => renderNode(child, state)).join('');
}

function renderMarkdown(markdown, state) {
  const segments = splitAdmonitions(markdown);

  return segments
    .map((segment) => {
      if (segment.type === 'callout') {
        const meta = calloutMeta[segment.calloutType];
        const body = renderMarkdown(segment.value, state);
        const iconMarkup = icon(meta.iconDefinition, {
          classes: ['md-callout-icon'],
        }).html.join('');
        return `
          <div class="md-callout md-callout-${segment.calloutType}">
            <div class="md-callout-header">
              ${iconMarkup}
              <span>${meta.label}</span>
            </div>
            <div class="md-callout-body">${body}</div>
          </div>
        `;
      }

      const tree = processor.runSync(processor.parse(segment.value));
      return renderChildren(tree.children, state);
    })
    .join('');
}

function renderToc(items) {
  return `
    <ol>
      ${items
        .map(
          (item) => `
            <li class="toc-level-${Math.min(item.level, 3)}">
              <a href="#${item.id}">${item.label ? `${item.label} ` : ''}${escapeHtml(item.text)}</a>
              ${item.children.length ? renderToc(item.children) : ''}
            </li>
          `,
        )
        .join('')}
    </ol>
  `;
}

async function copyDirectory(sourceDir, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);
      if (entry.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await copyFile(sourcePath, targetPath);
      }
    }),
  );
}

async function copyDirectoryIfExists(sourceDir, targetDir) {
  try {
    await copyDirectory(sourceDir, targetDir);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

function buildHtml({ tocMarkup, chaptersMarkup }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Software Testing</title>
    <link rel="stylesheet" href="./styles.css" />
    <link rel="stylesheet" href="./assets/katex.min.css" />
    <link rel="stylesheet" href="./assets/highlight.css" />
  </head>
  <body>
    <div class="book-shell">
      <header class="book-cover" id="top">
        <div class="cover-topline">
          <div class="cover-badge">Professional Edition</div>
          <span class="cover-edition">Software Quality Series</span>
        </div>
        <div class="cover-grid">
          <div class="cover-main">
            <p class="cover-kicker">Software Engineering &middot; Testing Practice &middot; Reference</p>
            <p class="cover-overline">A practical handbook for systematic quality assurance</p>
            <h1>Software Testing</h1>
            <p class="cover-subtitle">
              A structured field guide to black-box techniques, automation strategy, performance analysis,
              and API validation for modern software teams.
            </p>
            <div class="cover-author-block">
              <span class="cover-author-label">Author</span>
              <p class="cover-author-name">Phong Vo</p>
            </div>
          </div>
          <aside class="cover-aside">
            <div class="cover-panel">
              <p class="cover-panel-label">In This Edition</p>
              <ul>
                <li>Black-box testing patterns and analysis models</li>
                <li>Automation design, locator strategy, and wait handling</li>
                <li>Performance and API testing study chapters</li>
              </ul>
            </div>
          </aside>
        </div>
        <div class="cover-meta">
          <span>Single-page book edition</span>
          <span>Print-ready PDF layout</span>
          <span>Built from Markdown</span>
        </div>
        <div class="cover-actions">
          <button class="primary" type="button" onclick="window.print()">Export PDF</button>
          <a class="ghost" href="#contents">Contents</a>
        </div>
      </header>

      <main class="book-content">
        <section class="contents-section" id="contents">
          <div class="contents-heading">
            <h2>Contents</h2>
          </div>
          <div class="contents-tree">
            ${tocMarkup}
          </div>
        </section>

        <div class="book-article">
          ${chaptersMarkup}
        </div>
      </main>
    </div>
  </body>
</html>`;
}

export async function buildBook() {
  const markdown = await readFile(path.join(rootDir, 'book.md'), 'utf8');
  const chapters = markdown
    .split(/\n<!--\s*chapter\s*-->\n/g)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const state = {
    counters: { h1: 0, h2: 0, h3: 0 },
    usedIds: new Set(),
    tocRoots: [],
    tocStack: [],
  };

  const chaptersMarkup = chapters
    .map(
      (chapter) => `
        <section class="chapter">
          <div class="chapter-body doc-page">
            ${renderMarkdown(chapter, state)}
          </div>
        </section>
      `,
    )
    .join('');

  const tocMarkup = renderToc(state.tocRoots);
  const html = buildHtml({ tocMarkup, chaptersMarkup });

  await mkdir(distDir, { recursive: true });
  await mkdir(assetsDir, { recursive: true });
  await writeFile(path.join(distDir, 'index.html'), html, 'utf8');
  await copyFile(path.join(rootDir, 'styles.css'), path.join(distDir, 'styles.css'));
  await copyFile(path.join(rootDir, 'node_modules', 'katex', 'dist', 'katex.min.css'), path.join(assetsDir, 'katex.min.css'));
  await copyFile(path.join(rootDir, 'node_modules', 'highlight.js', 'styles', 'vs.css'), path.join(assetsDir, 'highlight.css'));
  await copyDirectory(path.join(rootDir, 'node_modules', 'katex', 'dist', 'fonts'), path.join(assetsDir, 'fonts'));
  await copyDirectoryIfExists(staticDir, distDir);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildBook().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
