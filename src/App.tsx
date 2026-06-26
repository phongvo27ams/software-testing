import { useMemo } from 'react';
import { RichText } from './richText';

type Chapter = {
  id: string;
  title: string;
  summary: string;
  content: string;
};

type TocItem = {
  id: string;
  title: string;
  level: number;
  children: TocItem[];
};

const chapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Chapter 1. Foundations',
    summary: 'A gentle opening chapter with typography, callouts, and a lightweight code sample.',
    content: `
## 1.1 Getting Started

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan arcu. Proin accumsan, mauris quis volutpat dictum, turpis leo pharetra magna, a ultricies velit urna nec ipsum.

### 1.1.1 Core Idea

> Nunc vulputate, nibh eget commodo egestas, lacus ex sodales purus, at varius libero massa nec odio.

\`\`\`ts
type BookEntry = {
  id: string;
  title: string;
  paragraphCount: number;
};

const entry: BookEntry = {
  id: 'chapter-1',
  title: 'Foundations',
  paragraphCount: 3,
};

console.log(entry.title.toUpperCase());
\`\`\`

### 1.1.2 A Small Formula

Curabitur pretium, mauris sed vulputate posuere, sem nisl gravida leo, at auctor lorem eros sit amet arcu. Etiam in interdum ipsum. Integer eu dui vel lectus posuere bibendum.

$$
f(x) = \\int_0^1 x^2\\,dx = \\frac{1}{3}
$$

## 1.2 Reading Rhythm

Aliquam erat volutpat. Mauris feugiat, sem sed auctor feugiat, nisi velit luctus mauris, a ultricies nibh quam in erat.

### 1.2.1 Paragraph Flow

Morbi vitae velit vitae ipsum luctus tempor. Integer aliquet, nulla sed hendrerit facilisis, lacus lacus iaculis lorem, a pulvinar erat sapien vitae risus.
    `,
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2. Layout and Media',
    summary: 'Demonstrates responsive tables, images, and readable prose blocks.',
    content: `
## 2.1 Visual Blocks

Suspendisse potenti. Cras posuere, leo in porttitor posuere, turpis risus convallis odio, in maximus purus nulla ac nisl. Morbi sed blandit lorem.

### 2.1.1 Figure Placement

![A sample notebook spread](https://placehold.co/1200x520/png?text=Sample+Image+For+Documentation)

### 2.1.2 Table Example

| Element | Purpose | Note |
| --- | --- | --- |
| Heading | Establish hierarchy | Keep it short |
| Paragraph | Explain an idea | Prefer readable line length |
| Figure | Support understanding | Add captions in production |

## 2.2 Content Density

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer non sem sed urna porttitor luctus. Vivamus nec posuere mi, id feugiat sapien.

### 2.2.1 Subsection A

Praesent in lectus imperdiet, aliquet ex eget, malesuada mauris. Cras sed sem sed arcu interdum consequat.

### 2.2.2 Subsection B

Quisque rutrum porttitor leo, non fringilla lorem aliquet sed. Integer sit amet massa vel arcu bibendum vulputate.
    `,
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3. Writing for Print',
    summary: 'Focuses on page breaks, code readability, and a book-like print experience.',
    content: `
## 3.1 Print Strategy

Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Integer eget turpis in lectus ultricies rhoncus.

### 3.1.1 Code Sample

\`\`\`python
def chapter_score(pages: int, images: int) -> float:
    return pages * 0.75 + images * 0.5

print(chapter_score(12, 3))
\`\`\`

### 3.1.2 Print Formula

The print view should feel deliberate. In a paper-friendly layout, text should remain dense but comfortable, figures should avoid awkward splits, and code blocks should keep their borders and padding.

$$
\\text{readability} = \\frac{\\text{contrast} + \\text{spacing}}{\\text{noise}}
$$

## 3.2 Book Feel

Nam feugiat, mi eget venenatis viverra, lacus nibh interdum eros, sed porta metus urna sed urna.

### 3.2.1 Editorial Notes

Fusce sed volutpat justo. Etiam vel urna id ligula vulputate interdum. Integer eu ornare mi.
    `,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractToc(content: string) {
  const lines = content.split('\n');
  const items: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const line of lines) {
    const match = /^(#{2,4})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const level = match[1].length;
    const title = match[2].trim();
    const item: TocItem = {
      id: slugify(title),
      title,
      level,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      items.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    stack.push(item);
  }

  return items;
}

function renderToc(items: TocItem[]) {
  return (
    <ol>
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>{item.title}</a>
          {item.children.length > 0 && renderToc(item.children)}
        </li>
      ))}
    </ol>
  );
}

function App() {
  const toc = useMemo(() => chapters.flatMap((chapter) => extractToc(chapter.content)), []);

  return (
    <div className="book-shell">
      <header className="book-cover" id="top">
        <div className="cover-topline">
          <div className="cover-badge">Printed Edition</div>
          <span className="cover-edition">Volume I</span>
        </div>
        <div className="cover-grid">
          <div className="cover-main">
            <p className="cover-kicker">Markdown · CSS · PDF</p>
            <h1>Markdown Book</h1>
            <p className="cover-subtitle">
              A single-page writing workspace for long-form documentation, reading, and PDF export.
            </p>
          </div>
          <aside className="cover-aside">
            <div className="cover-panel">
              <p className="cover-panel-label">Edition Notes</p>
              <ul>
                <li>Book-like static layout</li>
                <li>Sidebar stays visible for fast navigation</li>
                <li>Print output excludes navigation</li>
              </ul>
            </div>
          </aside>
        </div>
        <div className="cover-meta">
          <span>Typography-first layout</span>
          <span>Static local preview</span>
          <span>Ready for PDF export</span>
        </div>
        <div className="cover-actions">
          <button className="primary" onClick={() => window.print()}>
            Export PDF
          </button>
          <a className="ghost" href="#chapter-1">
            Start reading
          </a>
        </div>
      </header>

      <main className="book-layout">
        <aside className="book-sidebar no-print">
          <div className="sidebar-card">
            <h2>Contents</h2>
            {renderToc(toc)}
          </div>

          <div className="sidebar-card">
            <h2>Print Tips</h2>
            <ul>
              <li>Use the browser print dialog to save as PDF.</li>
              <li>Sidebar is hidden automatically in print mode.</li>
              <li>Headings support quick navigation down to level 3.</li>
            </ul>
          </div>
        </aside>

        <article className="book-article">
          {chapters.map((chapter) => (
            <section className="chapter" id={chapter.id} key={chapter.id}>
              <p className="chapter-index">Chapter</p>
              <h2>{chapter.title}</h2>
              <p className="chapter-summary">{chapter.summary}</p>
              <div className="chapter-body">
                <RichText value={chapter.content} />
              </div>
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}

export default App;
