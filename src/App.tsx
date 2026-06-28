import { useMemo } from 'react';
import { RichText } from './richText';
import bookOrder from '../book-order.json';

type DocRecord = {
  path: string;
  content: string;
};

type TocItem = {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
};

type HeadingRecord = {
  id: string;
  text: string;
  level: number;
};

type HeadingCounters = {
  h1: number;
  h2: number;
  h3: number;
};

type HeadingLabelMap = Record<string, string>;

type DocOutline = {
  anchor: string;
  title: string;
  labels: HeadingLabelMap;
  toc: TocItem;
  rootNumber: string;
};

const rawDocs = import.meta.glob('../docs/**/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const rawDocEntries = Object.entries(rawDocs).map(([path, source]) => ({
  path: path.replace(/^\.\.\//, ''),
  content: String(source).trim(),
}));

const docsByPath = new Map(rawDocEntries.map((doc) => [doc.path, doc]));

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractHeadings(content: string) {
  const lines = content.split('\n');
  const headings: HeadingRecord[] = [];

  for (const line of lines) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/\s+#+\s*$/, '').trim();
    headings.push({
      level,
      text,
      id: slugify(text),
    });
  }

  return headings;
}

const orderedDocs: DocRecord[] = (bookOrder as string[])
  .map((path) => docsByPath.get(path))
  .filter((doc): doc is { path: string; content: string } => Boolean(doc))
  .map((doc) => ({
    path: doc.path,
    content: doc.content,
  }));

function buildDocOutline(doc: DocRecord, index: number, globalState: HeadingCounters): DocOutline {
  const headings = extractHeadings(doc.content).filter((heading) => heading.level >= 1 && heading.level <= 3);
  const firstHeading = headings[0];
  const anchor = firstHeading?.id ?? `document-${index + 1}`;
  const labels: HeadingLabelMap = {};
  let chapter = globalState.h1;
  let section = globalState.h2;
  let subsection = globalState.h3;
  let rootNumber = '1';

  if (firstHeading?.level === 1) {
    chapter += 1;
    section = 0;
    subsection = 0;
    rootNumber = `${chapter}`;
  } else if (firstHeading?.level === 2) {
    if (chapter === 0) chapter = 1;
    section += 1;
    subsection = 0;
    rootNumber = `${chapter}.${section}`;
  } else if (firstHeading?.level === 3) {
    if (chapter === 0) chapter = 1;
    if (section === 0) section = 1;
    subsection += 1;
    rootNumber = `${chapter}.${section}.${subsection}`;
  }

  const rootLevel = firstHeading?.level ?? 1;
  const root: TocItem = {
    id: anchor,
    text: `${rootNumber} ${firstHeading?.text ?? `Document ${index + 1}`}`,
    level: rootLevel,
    children: [],
  };
  const stack: TocItem[] = [root];

  let localChapter = chapter;
  let localSection = section;
  let localSubsection = subsection;

  for (const heading of headings) {
    if (heading === firstHeading) {
      labels[heading.id] = rootNumber;
      continue;
    }

    if (heading.level === 1) {
      chapter += 1;
      section = 0;
      subsection = 0;
      localChapter = chapter;
      localSection = 0;
      localSubsection = 0;
      labels[heading.id] = `${localChapter}`;
    } else if (heading.level === 2) {
      section += 1;
      subsection = 0;
      localSection = section;
      localSubsection = 0;
      labels[heading.id] = `${localChapter}.${localSection}`;
    } else if (heading.level === 3) {
      subsection += 1;
      localSubsection = subsection;
      labels[heading.id] = `${localChapter}.${localSection}.${localSubsection}`;
    }

    const item: TocItem = {
      id: `${anchor}-${heading.id}`,
      text: `${labels[heading.id]} ${heading.text}`,
      level: heading.level,
      children: [],
    };

    while (stack.length > 1 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    stack[stack.length - 1].children.push(item);
    stack.push(item);
  }

  globalState.h1 = chapter;
  globalState.h2 = section;
  globalState.h3 = subsection;

  return {
    anchor,
    title: firstHeading?.text ?? `Document ${index + 1}`,
    labels,
    toc: root,
    rootNumber,
  };
}

function App() {
  const docs = useMemo(() => orderedDocs, []);
  const outlines = useMemo(() => {
    const state: HeadingCounters = { h1: 0, h2: 0, h3: 0 };
    return docs.map((doc, index) => buildDocOutline(doc, index, state));
  }, [docs]);

  function renderTocItem(item: TocItem) {
    return (
      <li key={item.id} className={`toc-level-${Math.min(item.level, 3)}`}>
        <a href={`#${item.id}`}>{item.text}</a>
        {item.children.length > 0 ? <ol>{item.children.map(renderTocItem)}</ol> : null}
      </li>
    );
  }

  return (
    <div className="book-shell">
      <header className="book-cover" id="top">
        <div className="cover-topline">
          <div className="cover-badge">Printed Edition</div>
          <span className="cover-edition">Volume I</span>
        </div>
        <div className="cover-grid">
          <div className="cover-main">
            <p className="cover-kicker">Markdown · MDX · PDF</p>
            <h1>Markdown Book</h1>
            <p className="cover-subtitle">
              A multi-page writing workspace for long-form documentation, reading, and PDF export.
            </p>
          </div>
          <aside className="cover-aside">
            <div className="cover-panel">
              <p className="cover-panel-label">Edition Notes</p>
              <ul>
                <li>Single continuous reading page</li>
                <li>MDX files live in <code>docs/</code></li>
                <li>Print view matches the full page flow</li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="cover-meta">
          <span>Static local preview</span>
          <span>Single-page book flow</span>
          <span>Ready for PDF export</span>
        </div>
        <div className="cover-actions">
          <button className="primary" onClick={() => window.print()}>
            Export PDF
          </button>
          <a className="ghost" href="#contents">
            Contents
          </a>
        </div>
      </header>

      <main className="book-content">
        <section className="contents-section" id="contents">
          <div className="contents-heading">
            <h2>Contents</h2>
          </div>
          <div className="contents-tree">
            <ol>
              {outlines.map((outline) => renderTocItem(outline.toc))}
            </ol>
          </div>
        </section>

        <div className="book-article">
          {docs.map((doc, index) => {
            const outline = outlines[index];
            const docId = `${outline.anchor}-`;

            return (
              <section className="chapter" id={outline.anchor} key={doc.path}>
                <div className="chapter-body doc-page">
                  <RichText value={doc.content} idPrefix={docId} labels={outline.labels} />
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;
