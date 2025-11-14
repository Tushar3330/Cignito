"use client";

import React from "react";
import dynamic from "next/dynamic";

// Import MDEditor with dynamic import for SSR compatibility
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="border-3 border-black rounded-[20px] shadow-100 p-4 min-h-[300px] bg-white">
        <p className="text-black-300">Loading editor...</p>
      </div>
    ),
  }
);

interface DarkModeEditorProps {
  value: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  height?: number;
}

const DarkModeEditor = ({ value, onChange, placeholder = "", height = 300 }: DarkModeEditorProps) => {
  return (
    <div data-color-mode="light" className="w-md-editor-container">
      <div className="border-3 border-black rounded-[20px] shadow-100 overflow-hidden">
        <MDEditor
          value={value}
          onChange={onChange}
          preview="edit"
          height={height}
          visibleDragbar={false}
          hideToolbar={false}
          textareaProps={{
            placeholder,
          }}
        />
      </div>
    </div>
  );
};

export default DarkModeEditor;