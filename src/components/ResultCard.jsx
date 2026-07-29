import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import CopyButton from "./CopyButton";
import KeywordChip from "./KeywordChip";

const badgeConfig = {
  queued: {
    icon: null,
    fg: "#d8d0c6",
    bg: "rgba(28,24,21,0.72)",
    label: "Queued",
  },
  processing: {
    icon: Loader2,
    fg: "#241a06",
    bg: "#e8b14c",
    label: "Generating",
  },
  done: { icon: CheckCircle2, fg: "#062418", bg: "#5fd4a8", label: "Done" },
  needs_retry: {
    icon: AlertCircle,
    fg: "#2a0709",
    bg: "#e5525c",
    label: "Needs retry",
  },
};

export default function ResultCard({ item, onRetry }) {
  const [expanded, setExpanded] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const badge = badgeConfig[item.status];
  const BadgeIcon = badge.icon;
  const fullCopyText =
    item.status === "done"
      ? `${item.title}\n\n${item.description}\n\nKeywords: ${item.keywords.join(", ")}`
      : "";

  const titleWords = item.title.trim().split(/\s+/).filter(Boolean);
  const descWords = item.description.trim().split(/\s+/).filter(Boolean);
  const titleTruncated = titleWords.length > 7;
  const descTruncated = descWords.length > 15;
  const titleText =
    showFullTitle || !titleTruncated
      ? item.title
      : `${titleWords.slice(0, 7).join(" ")}…`;
  const descText =
    showFullDescription || !descTruncated
      ? item.description
      : `${descWords.slice(0, 15).join(" ")}…`;
  const visibleTags = expanded ? item.keywords : item.keywords.slice(0, 6);
  const hiddenCount = item.keywords.length - 6;

  return (
    <div
      className="result-card"
      style={{
        width: 300,
        background:
          "linear-gradient(180deg, var(--bg-raised), var(--bg-inset))",
        border: "1px solid var(--line)",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
      }}
    >
      {/* image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 200,
          background: "var(--bg)",
          overflow: "hidden",
        }}
      >
        {item.thumbUrl && (
          <img
            className="result-card-img"
            src={item.thumbUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}

        {/* scrim so badges never fight the photo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: ".02em",
            padding: "4px 10px 4px 8px",
            borderRadius: 20,
            background: badge.bg,
            color: badge.fg,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {BadgeIcon && (
            <BadgeIcon
              size={11}
              className={item.status === "processing" ? "spin-icon" : ""}
            />
          )}
          {badge.label}
        </span>

        {item.status === "done" && (
          <div style={{ position: "absolute", top: 8, right: 8 }}>
            <GlassIconButton text={fullCopyText} label="Copy all" />
          </div>
        )}

        {item.status === "needs_retry" && (
          <button
            onClick={() => onRetry(item.id)}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20,
              padding: "6px 12px",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw size={12} /> Retry
          </button>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 10,
            right: 10,
            fontSize: 10,
            color: "rgba(255,255,255,0.75)",
            fontFamily: "var(--mono)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.file.name}
        </div>
      </div>

      {/* body */}
      <div
        style={{
          padding: "14px 15px 15px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
        }}
      >
        {item.status === "done" ? (
          <>
            <div>
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
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: "var(--text)",
                    letterSpacing: "-0.005em",
                  }}
                >
                  {titleText}
                </div>
                <CopyButton
                  text={item.title}
                  label="Copy title"
                  iconOnly
                  size={13}
                />
              </div>
              {titleTruncated && (
                <button
                  onClick={() => setShowFullTitle((v) => !v)}
                  style={linkBtn}
                >
                  {showFullTitle ? "Show less" : "Read full title"}
                </button>
              )}
            </div>

            <div style={{ height: 1, background: "var(--line)" }} />

            <div>
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
                    lineHeight: 1.6,
                  }}
                >
                  {descText}
                </div>
                <CopyButton
                  text={item.description}
                  label="Copy description"
                  iconOnly
                  size={13}
                />
              </div>
              {descTruncated && (
                <button
                  onClick={() => setShowFullDescription((v) => !v)}
                  style={linkBtn}
                >
                  {showFullDescription ? "Show less" : "Read full description"}
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                alignItems: "center",
                marginTop: 2,
              }}
            >
              {visibleTags.map((k, i) => (
                <KeywordChip key={i} word={k} />
              ))}
              {!expanded && hiddenCount > 0 && (
                <button onClick={() => setExpanded(true)} style={tagToggleBtn}>
                  +{hiddenCount} <ChevronDown size={11} />
                </button>
              )}
              {expanded && item.keywords.length > 6 && (
                <button onClick={() => setExpanded(false)} style={tagToggleBtn}>
                  less <ChevronUp size={11} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "var(--text-faint)",
              padding: "6px 0",
            }}
          >
            {item.status === "processing" && (
              <Loader2 size={13} className="spin-icon" color="var(--dev)" />
            )}
            {item.status === "queued" &&
              (item.kind === "video"
                ? "Frame captured — waiting in queue"
                : "Waiting in queue")}
            {item.status === "processing" && "Generating metadata…"}
            {item.status === "needs_retry" &&
              "Failed — tap retry on the photo above"}
          </div>
        )}
      </div>
    </div>
  );
}

function GlassIconButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }
  return (
    <button
      onClick={handleCopy}
      title={label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: copied ? "var(--fix)" : "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: copied ? "#062418" : "#fff",
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

const linkBtn = {
  background: "none",
  border: "none",
  padding: "3px 0 0",
  margin: 0,
  fontSize: 11,
  fontWeight: 600,
  color: "var(--safelight)",
  cursor: "pointer",
};

const tagToggleBtn = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "transparent",
  border: "1px dashed var(--line-bright)",
  color: "var(--text-dim)",
  fontSize: 10.5,
  fontWeight: 600,
  padding: "3px 8px",
  borderRadius: 20,
  cursor: "pointer",
};
