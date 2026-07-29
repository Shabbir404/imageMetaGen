import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({
  text,
  label,
  size = 14,
  iconOnly = false,
}) {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  async function handleCopy(e) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  const bg = copied
    ? "rgba(95,191,143,0.14)"
    : hover
      ? "var(--bg-inset)"
      : "transparent";
  const border = copied
    ? "rgba(95,191,143,0.35)"
    : hover
      ? "var(--line-bright)"
      : "transparent";
  const fg = copied
    ? "var(--fix)"
    : hover
      ? "var(--text-dim)"
      : "var(--text-faint)";

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label || "Copy"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: iconOnly ? 6 : "5px 10px",
        borderRadius: 7,
        border: `1px solid ${border}`,
        background: bg,
        color: fg,
        cursor: "pointer",
        transition:
          "background .15s ease, border-color .15s ease, color .15s ease",
        outline: "none",
      }}
      onFocus={(e) =>
        (e.currentTarget.style.boxShadow = "0 0 0 2px rgba(167,139,250,0.35)")
      }
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {copied ? (
        <Check size={size} strokeWidth={2.5} />
      ) : (
        <Copy size={size} strokeWidth={2} />
      )}
      {!iconOnly && (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "var(--display)",
          }}
        >
          {copied ? "Copied" : label}
        </span>
      )}
    </button>
  );
}
