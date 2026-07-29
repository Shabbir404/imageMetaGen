import { useState } from "react";
import { Check } from "lucide-react";

export default function KeywordChip({ word }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(word);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch {}
  }

  return (
    <button
      onClick={handleClick}
      className="mono"
      title="Click to copy"
      style={{
        fontSize: 10.5,
        padding: "3px 9px",
        borderRadius: 20,
        background: copied ? "rgba(255,106,61,0.15)" : "var(--bg)",
        border: `1px solid ${copied ? "var(--safelight)" : "var(--line)"}`,
        color: copied ? "var(--safelight)" : "var(--text-dim)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 4,
        transition: "all .12s",
      }}
    >
      {copied && <Check size={9} />} {word}
    </button>
  );
}
