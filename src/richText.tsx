import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

export function RichText({ value }: { value: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, rehypeHighlight]}
      components={{
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
