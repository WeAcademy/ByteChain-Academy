"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No content available for this lesson.</p>
      </div>
    )
  }

  return (
    <div className="prose prose-invert max-w-none prose-headings:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-8 prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-6 prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-a:text-[#00ff88] prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-[#00ff88] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-4 prose-blockquote:border-l-[#00ff88] prose-blockquote:bg-[#00ff88]/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:marker:text-[#00ff88] prose-table:border-collapse prose-th:border prose-th:border-white/10 prose-th:bg-white/5 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-white/10 prose-td:px-4 prose-td:py-2 prose-hr:border-white/10">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
