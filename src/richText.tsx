import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function headingRenderer(level: 1 | 2 | 3) {
  return function Heading({ children, ...props }: { children?: React.ReactNode }) {
    const text = Array.isArray(children) ? children.join(' ') : String(children ?? '');
    const Tag = `h${level}` as const;
    return (
      <Tag id={slugify(text)} {...props}>
        {children}
      </Tag>
    );
  };
}

export function RichText({ value }: { value: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
      components={{
        h1: headingRenderer(1),
        h2: headingRenderer(2),
        h3: headingRenderer(3),
        p: ({ ...props }) => <p className="md-paragraph" {...props} />,
        pre: ({ ...props }) => <pre className="md-pre" {...props} />,
        img: ({ ...props }) => <img className="md-image" alt="" {...props} />,
        table: ({ ...props }) => (
          <div className="md-table-wrap">
            <table className="md-table" {...props} />
          </div>
        ),
      }}
    >
      {value}
    </ReactMarkdown>
  );
}
