"use client"
import React, { useState } from "react";

interface TerminalCommandProps {
  command: string;
}

const TerminalCommand: React.FC<TerminalCommandProps> = ({ command }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="flex items-center bg-background border border-border rounded-lg px-4 py-2 font-mono text-sm text-foreground shadow-sm max-w-full transition-colors duration-300"
      style={{ minWidth: 260 }}
    >
      <span className="select-all flex-1 break-all">{command}</span>
      <button
        onClick={handleCopy}
        className={`ml-3 px-3 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:focus:ring-offset-zinc-900 ${
          copied
            ? "bg-success text-success-foreground border-success"
            : "bg-background text-foreground hover:bg-muted hover:text-primary transition-colors duration-300"
        }`}
        aria-label="Copy command"
        type="button"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default TerminalCommand; 