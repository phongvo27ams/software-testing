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
  const headings: TocItem[] = [];

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

function docLabel(index: number, doc: DocRecord) {
  const firstHeading = extractHeadings(doc.content)[0]?.text;
  return firstHeading ?? `Document ${index + 1}`;
}

function App() {
  const docs = useMemo(() => orderedDocs, []);
  const toc = useMemo(
    () =>
      docs.flatMap((doc, index) => {
        const docId = `doc-${index + 1}`;
        const headings = extractHeadings(doc.content).map((heading) => ({
          ...heading,
          href: `#${docId}-${heading.id}`,
        }));
        return [
          {
            href: `#${docId}`,
            text: docLabel(index, doc),
            level: 1,
          },
          ...headings,
        ];
      }),
    [docs],
  );

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
            <p className="chapter-index">Contents</p>
            <h2>Contents</h2>
          </div>
          <div className="contents-tree">
            <ol>
              {toc.map((item, index) => (
                <li
                  key={`${item.href}-${index}`}
                  className={item.level > 1 ? 'contents-child' : 'contents-root'}
                >
                  <a href={item.href}>{item.text}</a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="book-article">
          {docs.map((doc, index) => {
            const docId = `doc-${index + 1}-`;

            return (
              <section className="chapter" id={`doc-${index + 1}`} key={doc.path}>
                <p className="chapter-index">{docLabel(index, doc)}</p>
                <div className="chapter-body doc-page">
                  <RichText value={doc.content} idPrefix={docId} />
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
