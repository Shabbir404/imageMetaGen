import { useState } from "react";
import { RotateCcw, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import CopyButton from "./CopyButton";
import KeywordChip from "./KeywordChip";

const badgeStyle = {
  queued: { bg: "rgba(0,0,0,0.55)", fg: "#c9c1b8", label: "Queued" },
  processing: {
    bg: "rgba(232,177,76,0.85)",
    fg: "#241a06",
    label: "Generating",
  },
  done: { bg: "rgba(95,212,168,0.9)", fg: "#062418", label: "Done" },
  needs_retry: {
    bg: "rgba(229,82,92,0.9)",
    fg: "#2a0709",
    label: "Needs retry",
  },
};

export default function ResultCard({ item, onRetry }) {
  const [expanded, setExpanded] = useState(false);
  const b = badgeStyle[item.status];
  const fullCopyText =
    item.status === "done"
      ? `${item.title}\n\n${item.description}\n\nKeywords: ${item.keywords.join(", ")}`
      : "";
  const visibleTags = expanded ? item.keywords : item.keywords.slice(0, 3);
  const hiddenCount = item.keywords.length - 3;

  return (
    <div
      style={{
        background: "var(--bg-raised)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          background: "var(--bg-inset)",
        }}
      >
        {item.thumbUrl && (
          <img
            src={item.thumbUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
        <span
          className="mono"
          style={{
            position: "absolute",
            top: 9,
            left: 9,
            fontSize: 10,
            padding: "3px 9px",
            borderRadius: 20,
            background: b.bg,
            color: b.fg,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 4,
            backdropFilter: "blur(4px)",
          }}
        >
          {item.status === "done" && <CheckCircle2 size={10} />} {b.label}
        </span>
        {item.status === "done" && (
          <div style={{ position: "absolute", top: 7, right: 7 }}>
            <CopyButton
              text={fullCopyText}
              label="Copy all"
              iconOnly
              size={13}
            />
          </div>
        )}
        {item.status === "needs_retry" && (
          <button
            onClick={() => onRetry(item.id)}
            style={{
              position: "absolute",
              bottom: 9,
              right: 9,
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: 20,
              padding: "5px 10px",
              color: "#fff",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={11} /> retry
          </button>
        )}
      </div>

      {/* body */}
      <div
        style={{
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--text-faint)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.file.name}
        </div>

        {item.status === "done" ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: "var(--text)",
                }}
              >
                {item.title}
              </div>
              <CopyButton
                text={item.title}
                label="Copy title"
                iconOnly
                size={12}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-dim)",
                  lineHeight: 1.5,
                }}
              >
                {item.description}
              </div>
              <CopyButton
                text={item.description}
                label="Copy description"
                iconOnly
                size={12}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 5,
                alignItems: "center",
                marginTop: 2,
              }}
            >
              {visibleTags.map((k, i) => (
                <KeywordChip key={i} word={k} />
              ))}
              {!expanded && hiddenCount > 0 && (
                <button onClick={() => setExpanded(true)} style={viewMoreBtn}>
                  +{hiddenCount} more <ChevronDown size={11} />
                </button>
              )}
              {expanded && item.keywords.length > 3 && (
                <button onClick={() => setExpanded(false)} style={viewMoreBtn}>
                  show less <ChevronUp size={11} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
            {item.kind === "video"
              ? "frame captured from video"
              : "waiting to generate…"}
          </div>
        )}
      </div>
    </div>
  );
}

const viewMoreBtn = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "var(--bg-inset)",
  border: "1px solid var(--line)",
  color: "var(--safelight)",
  fontSize: 10.5,
  fontWeight: 700,
  padding: "3px 9px",
  borderRadius: 20,
  cursor: "pointer",
};
