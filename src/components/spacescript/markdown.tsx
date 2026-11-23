"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

/**
 * SpaceScript syntax theme — amber / emerald / teal / rose neutrals.
 */
const spaceSyntax: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: "#f2eefc",
    fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
    fontSize: "0.8rem",
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  'pre[class*="language-"]': {
    color: "#f2eefc",
    background: "rgba(7, 5, 18, 0.92)",
    margin: 0,
    padding: "0.9rem 1rem",
    borderRadius: "0.75rem",
    overflow: "auto",
  },
  comment: { color: "#7d739b", fontStyle: "italic" },
  prolog: { color: "#7d739b" },
  doctype: { color: "#7d739b" },
  cdata: { color: "#7d739b" },
  punctuation: { color: "#b8aee0" },
  property: { color: "#fbbf24" },
  tag: { color: "#fbbf24" },
  constant: { color: "#f59e0b" },
  symbol: { color: "#f59e0b" },
  deleted: { color: "#f43f5e" },
  boolean: { color: "#fb923c" },
  number: { color: "#fb923c" },
  selector: { color: "#2dd4bf" },
  "attr-name": { color: "#2dd4bf" },
  string: { color: "#fbbf24" },
  char: { color: "#fbbf24" },
  builtin: { color: "#2dd4bf" },
  inserted: { color: "#2dd4bf" },
  operator: { color: "#c4b5fd" },
  entity: { color: "#c4b5fd" },
  url: { color: "#c4b5fd" },
  atrule: { color: "#f59e0b" },
  "attr-value": { color: "#fbbf24" },
  keyword: { color: "#f59e0b" },
  function: { color: "#fbbf24" },
  "class-name": { color: "#fb923c" },
  regex: { color: "#2dd4bf" },
  important: { color: "#f59e0b", fontWeight: "bold" },
  variable: { color: "#e9d5ff" },
};

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={`md-body ${className ?? ""}`}>
      <ReactMarkdown
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className: codeClassName, children, ...rest }) => {
            const match = /language-(\w+)/.exec(codeClassName ?? "");
            const raw = String(children);
            const isBlock = Boolean(match) || raw.includes("\n");
            if (!isBlock) {
              return (
                <code className={codeClassName} {...rest}>
                  {children}
                </code>
              );
            }
            return (
              <SyntaxHighlighter
                language={match?.[1] ?? "text"}
                style={spaceSyntax}
                PreTag="div"
                customStyle={{
                  background: "rgba(7,5,18,0.92)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(168,85,247,0.22)",
                  fontSize: "0.8rem",
                  margin: "0.6rem 0",
                }}
              >
                {raw.replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
