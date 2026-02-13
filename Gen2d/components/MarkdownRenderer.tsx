import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import python from "highlight.js/lib/languages/python";
import 'highlight.js/styles/github-dark.css';

type Props = {
    content: string;
};

function ensureCodeBlock(content: string): string {
    if (content.includes("```")) return content;

    return `\`\`\`python\n${content}\n\`\`\``;
}

const MarkdownRenderer: React.FC<Props> = ({ content }: { content: string }) => {
    const processedContent = ensureCodeBlock(content);
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeHighlight, { languages: { python } }]]}
            components={{
                code({ inline, className, children, ...props }) {
                    if (inline) {
                        return (
                            <code className="bg-neutral-800 px-1 rounded" {...props}>
                                {children}
                            </code>
                        );
                    }

                    return (
                        <pre className="rounded-xl shadow-xl overflow-x-auto p-4 bg-neutral-900">
                            <code className={className + " whitespace-pre-wrap"} {...props}>
                                {children}
                            </code>
                        </pre>
                    );
                },
            }}
        >
            {processedContent}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;