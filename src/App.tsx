import { useEffect, useMemo, useState } from 'react';
import { RichText } from './richText';

type DocMeta = {
  title: string;
  summary: string;
  route: string;
  level: number;
  order: number;
  parentRoute?: string;
  sectionLabel?: string;
  chapterLabel?: string;
};

type DocRecord = DocMeta & {
  content: string;
};

const rawDocs = import.meta.glob('../docs/**/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function parseFrontmatter(source: string) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(source);
  if (!match) {
    throw new Error('Each doc file must start with frontmatter.');
  }

  const metaLines = match[1].split('\n').filter(Boolean);
  const meta = Object.fromEntries(
    metaLines.map((line) => {
      const index = line.indexOf(':');
      if (index === -1) return ['', ''];
      const key = line.slice(0, index).trim();
      const rawValue = line.slice(index + 1).trim();
      const value = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      return [key, value];
    }),
  ) as Record<string, string>;

  return {
    data: {
      title: meta.title ?? '',
      summary: meta.summary ?? '',
      route: meta.route ?? '',
      level: Number(meta.level ?? 0),
      order: Number(meta.order ?? 0),
      parentRoute: meta.parentRoute,
      sectionLabel: meta.sectionLabel,
      chapterLabel: meta.chapterLabel,
    } satisfies DocMeta,
    content: match[2].trim(),
  };
}

const allDocs: DocRecord[] = Object.values(rawDocs)
  .map((source) => parseFrontmatter(source as string))
  .map((parsed) => ({ ...parsed.data, content: parsed.content }))
  .sort((a, b) => a.order - b.order);

function trimBase(pathname: string) {
  const base = import.meta.env.BASE_URL || '/';
  if (base !== '/' && pathname.startsWith(base)) {
    return pathname.slice(base.length - 1) || '/';
  }
  return pathname;
}

function routeHref(route: string) {
  const base = import.meta.env.BASE_URL || '/';
  return route === '/' ? base : `${base}${route.slice(1)}`;
}

function resolveDoc(pathname: string) {
  const path = trimBase(pathname).replace(/\/+$/, '') || '/';
  return allDocs.find((doc) => doc.route === path) ?? allDocs[0];
}

function NavTree({ currentRoute }: { currentRoute: string }) {
  const roots = allDocs.filter((doc) => doc.level === 1);

  function renderBranch(parentRoute: string) {
    const children = allDocs.filter((doc) => doc.parentRoute === parentRoute);
    if (children.length === 0) return null;

    return (
      <ol>
        {children.map((child) => (
          <li key={child.route}>
            <a className={currentRoute === child.route ? 'is-active' : ''} href={routeHref(child.route)}>
              {child.chapterLabel ?? child.sectionLabel ?? child.title}
            </a>
            {renderBranch(child.route)}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol>
      {roots.map((chapter) => (
        <li key={chapter.route}>
          <a className={currentRoute === chapter.route ? 'is-active' : ''} href={routeHref(chapter.route)}>
            {chapter.chapterLabel ?? chapter.title}
          </a>
          {renderBranch(chapter.route)}
        </li>
      ))}
    </ol>
  );
}

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  const currentDoc = useMemo(() => resolveDoc(pathname), [pathname]);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (!href.startsWith('/')) return;
      event.preventDefault();
      window.history.pushState({}, '', href);
      setPathname(window.location.pathname);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

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
                <li>One page per subsection</li>
                <li>MDX files live in <code>docs/</code></li>
                <li>Print view can aggregate all pages</li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="cover-meta">
          <span>Static local preview</span>
          <span>Multi-page navigation</span>
          <span>Ready for PDF export</span>
        </div>
        <div className="cover-actions">
          <button className="primary" onClick={() => window.print()}>
            Export PDF
          </button>
          <a className="ghost" href={routeHref('/')}>
            Home
          </a>
        </div>
      </header>

      <main className="book-layout">
        <aside className="book-sidebar no-print">
          <div className="sidebar-card">
            <h2>Contents</h2>
            <NavTree currentRoute={currentDoc.route} />
          </div>
        </aside>

        <article className="book-article">
          <section className="chapter" id={currentDoc.route.slice(1) || 'home'}>
            <p className="chapter-index">
              {currentDoc.level === 1 ? 'Chapter' : currentDoc.level === 2 ? 'Section' : 'Subsection'}
            </p>
            <h2>{currentDoc.title}</h2>
            <p className="chapter-summary">{currentDoc.summary}</p>
            <div className="chapter-body doc-page">
              <RichText value={currentDoc.content} />
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}

export default App;
