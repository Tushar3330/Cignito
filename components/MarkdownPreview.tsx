"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

const MarkdownPreview = ({ content, className = "" }: MarkdownPreviewProps) => {
  return (
    <div className={`markdown-preview ${className}`}>
      {content ? (
        <ReactMarkdown>{content}</ReactMarkdown>
      ) : (
        <p className="text-gray-400">No content to display</p>
      )}
    </div>
  );
};

export default MarkdownPreview;