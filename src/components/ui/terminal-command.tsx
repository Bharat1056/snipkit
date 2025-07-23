'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface TerminalCommandProps {
  command: string;
  ellipsis?: boolean;
}

export function TerminalCommand({
  command,
  ellipsis = false,
}: TerminalCommandProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setHasCopied(true);
    toast.success('Copied!');
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-[#0d0d0d] font-mono text-sm ring-1 ring-white/10 flex items-center px-1">
      <code
        className={`block py-3 pl-4 pr-14 text-gray-300 ${
          ellipsis
            ? 'truncate max-w-full'
            : 'whitespace-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700'
        }`}
      >
        <span className="mr-2 text-white/40">$</span>
        {command}
      </code>

      <Button
        aria-label="Copy to clipboard"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="h-9 w-9 p-0 text-gray-400 hover:text-white focus-visible:ring-2 focus-visible:ring-emerald-500 flex-shrink-0"
      >
        {hasCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
