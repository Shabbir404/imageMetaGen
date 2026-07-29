import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  text,
  label,
  size = 14,
  iconOnly = false,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  return (
    <button
      onClick={handleCopy}
      title={label || "Copy"}
      className={`
        flex items-center justify-center gap-1.5 rounded-md transition-all duration-200
        ${iconOnly ? "p-1.5" : "px-2 py-1"}
        ${
          copied
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
        }
      `}
    >
      {copied ? <Check size={size} strokeWidth={2.5} /> : <Copy size={size} />}
      {!iconOnly && (
        <span className="text-xs font-semibold">
          {copied ? "Copied" : label}
        </span>
      )}
    </button>
  );
}
