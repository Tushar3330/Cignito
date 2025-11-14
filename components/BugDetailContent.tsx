"use client";

import ReactMarkdown from "react-markdown";
import { Code2, AlertTriangle } from "lucide-react";

interface BugDetailContentProps {
  description: string;
  codeSnippet?: string | null;
  images?: string[];
}

const BugDetailContent = ({ description, codeSnippet, images }: BugDetailContentProps) => {
  // Filter out empty strings from images array
  const validImages = images?.filter(img => img && img.trim() !== '') || [];

  return (
    <>
      {/* Bug Description - Markdown */}
      <div className="mb-8 bg-white p-8 rounded-xl border-4 border-black shadow-100">
        <h2 className="text-24-black mb-4 flex items-center gap-2">
          <AlertTriangle className="size-6" />
          Bug Description
        </h2>
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-32-bold mb-4 border-b-2 border-black pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-26-semibold mb-3 border-b border-black-100 pb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-20-medium mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-16-medium mb-4 leading-relaxed text-black-300">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-16-medium">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-16-medium">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-black-300 ml-4">{children}</li>
              ),
              code: ({ inline, children, ...props }: any) => {
                return inline ? (
                  <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-sm font-semibold border border-primary/20">
                    {children}
                  </code>
                ) : (
                  <code
                    className="block bg-black-200 text-white p-4 rounded-lg overflow-x-auto font-mono text-sm my-4 border-3 border-black"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-2 my-4 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary hover:underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-black">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-black">{children}</em>
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </div>

      {/* Code Snippet */}
      {codeSnippet && (
        <div className="mt-8">
          <h3 className="text-24-black mb-4 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-t-xl">
            <Code2 className="size-6" />
            Code Snippet
          </h3>
          <pre className="rounded-b-xl overflow-x-auto border-4 border-black shadow-100 bg-black-100 p-6">
            <code className="text-white-100 text-sm font-work-sans">
              {codeSnippet}
            </code>
          </pre>
        </div>
      )}

      {/* Screenshots */}
      {validImages && validImages.length > 0 && (
        <div className="mt-8">
          <h3 className="text-24-black mb-4 flex items-center gap-2">
            📸 Screenshots ({validImages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validImages.map((image, index) => (
              <div
                key={index}
                className="rounded-xl overflow-hidden border-4 border-black shadow-100 hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default BugDetailContent;
