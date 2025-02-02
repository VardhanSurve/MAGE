"use client"
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownPreview from "@uiw/react-markdown-preview";
import mermaid from "mermaid";

interface MarkdownWithMermaidProps {
  text: string;
}

const MarkdownWithMermaid = ({ text }: MarkdownWithMermaidProps) => {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.run();
  }, [text]);

  return (
    <MarkdownPreview
      source={text}
      components={{
        code({ node, className, children, ...props }) {
          const codeContent = String(children).trim();
          if (className === "language-mermaid") {
            return <div className="mermaid">{codeContent}</div>;
          }
          return <code className={className} {...props}>{children}</code>;
        },
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        table: ({ children }) => <table className="border-collapse border border-gray-300 w-full">{children}</table>,
        thead: ({ children }) => <thead className="bg-gray-200">{children}</thead>,
        th: ({ children }) => <th className="border border-gray-300 px-3 py-1">{children}</th>,
        td: ({ children }) => <td className="border border-gray-300 px-3 py-1">{children}</td>,
      }}
    />
  );
};

export default MarkdownWithMermaid;
