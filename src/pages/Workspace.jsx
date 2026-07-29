import ResultCard from "../components/ResultCard";
import CopyButton from "../components/CopyButton";
import KeywordChip from "../components/KeywordChip";
import { useEffect, useRef, useState } from "react";
import {
  UploadCloud,
  Globe,
  Layers,
  Image as ImageIcon,
  Film,
  FileText,
  Shapes,
  Tag,
  Download,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Wand2,
} from "lucide-react";
import { useAppState } from "../store/AppState";
import { extractVideoFrame, readImageAsBase64 } from "../lib/videoFrame";
import {
  createEpsPlaceholderPreview,
  detectFileKind,
  extractPdfFrame,
  extractPsdFrame,
  extractEpsFrame,
} from "../lib/fileConversion";

async function requestEpsPreview(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:3001/api/eps/preview", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("eps_preview_failed");
  }

  const data = await response.json();
  return {
    thumbUrl: data.previewUrl,
    base64: data.previewUrl?.split(",")[1] || null,
    mimeType: data.mimeType || "image/png",
  };
}
import { generateMetadata } from "../lib/generate";

const platforms = [
  { id: "general", label: "General", icon: Globe, color: "var(--safelight)" },
  { id: "adobe", label: "Adobe", icon: Layers, color: "#ff0000" },
  { id: "shutterstock", label: "Shutter", icon: ImageIcon, color: "#ff5200" },
  { id: "istock", label: "iStock", icon: Film, color: "#00b4ff" },
  { id: "getty", label: "Getty", icon: Tag, color: "#000000" },
  { id: "pond5", label: "Pond5", icon: Film, color: "#0097a7" },
  { id: "vecteezy", label: "Vecteezy", icon: Shapes, color: "#00b3e5" },
  { id: "freepik", label: "Freepik", icon: FileText, color: "#3bb4ff" },
];

const badgeStyle = {
  queued: { bg: "#1c1815", fg: "var(--text-faint)", label: "Queued" },
  processing: { bg: "#2a2013", fg: "var(--dev)", label: "Generating" },
  done: { bg: "#132420", fg: "var(--fix)", label: "Done" },
  needs_retry: { bg: "#2a1315", fg: "var(--stop)", label: "Needs retry" },
};

const csvSchemas = {
  general: {
    headers: ["filename", "title", "description", "keywords"],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
    ],
  },
  adobe: {
    headers: [
      "Filename",
      "Title",
      "Description",
      "Keywords",
      "Category",
      "Releases",
    ],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
      "",
      "",
    ],
  },
  shutterstock: {
    headers: [
      "Filename",
      "Title",
      "Description",
      "Keywords",
      "Categories",
      "Illustration",
      "Editorial",
      "Mature Content",
    ],
    buildRow: (item) => [
      item.file.name,
      item.description || item.title,
      (item.description || item.title).slice(0, 150),
      item.keywords.join(", "),
      "",
      "",
      "",
      "",
    ],
  },
  istock: {
    headers: [
      "Filename",
      "Title",
      "Description",
      "Keywords",
      "Date Created",
      "Country",
      "City",
    ],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
      "",
      "",
      "",
    ],
  },
  getty: {
    headers: [
      "Filename",
      "Title",
      "Description",
      "Keywords",
      "Date Created",
      "Country",
      "City",
    ],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
      "",
      "",
      "",
    ],
  },
  pond5: {
    headers: [
      "Filename",
      "Title",
      "Description",
      "Keywords",
      "Price",
      "City",
      "Country",
    ],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
      "",
      "",
      "",
    ],
  },
  vecteezy: {
    headers: ["Filename", "Title", "Description", "Keywords", "License"],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.description,
      item.keywords.join(", "),
      "",
    ],
  },
  freepik: {
    headers: [
      "File name",
      "Title",
      "Description",
      "Keywords",
      "Prompt",
      "Model",
    ],
    buildRow: (item) => [
      item.file.name,
      item.title,
      item.title,
      item.keywords.join(", "),
      "",
      "",
    ],
  },
};

export default function Workspace() {
  const { keys, setKeys, keysRef, queue, setQueue, settings, setSettings } =
    useAppState();
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showCsvPicker, setShowCsvPicker] = useState(false);
  const [csvPlatform, setCsvPlatform] = useState(
    settings.platform || "general",
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    setCsvPlatform(settings.platform || "general");
  }, [settings.platform]);

  function onFiles(fileList) {
    const items = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      file,
      kind: detectFileKind(file),
      thumbUrl: null,
      base64: null,
      mimeType: null,
      status: "queued",
      title: "",
      description: "",
      keywords: [],
      error: null,
      preview: { status: "ready", thumbUrl: null, mimeType: null },
    }));
    setQueue((prev) => [...prev, ...items]);

    items.forEach(async (item) => {
      try {
        if (item.kind === "eps") {
          const placeholder = await createEpsPlaceholderPreview(item.file.name);
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    thumbUrl: placeholder.thumbUrl,
                    preview: {
                      status: "loading",
                      thumbUrl: placeholder.thumbUrl,
                      mimeType: placeholder.mimeType,
                    },
                  }
                : q,
            ),
          );

          try {
            const serverPreview = await requestEpsPreview(item.file);
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      thumbUrl: serverPreview.thumbUrl,
                      base64: serverPreview.base64,
                      mimeType: serverPreview.mimeType,
                      preview: {
                        status: "ready",
                        thumbUrl: serverPreview.thumbUrl,
                        mimeType: serverPreview.mimeType,
                      },
                    }
                  : q,
              ),
            );
          } catch {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      preview: {
                        status: "ready",
                        thumbUrl: placeholder.thumbUrl,
                        mimeType: placeholder.mimeType,
                      },
                    }
                  : q,
              ),
            );
          }
        }

        let result;
        switch (item.kind) {
          case "video":
            result = await extractVideoFrame(item.file);
            break;
          case "pdf":
            result = await extractPdfFrame(item.file);
            break;
          case "psd":
            result = await extractPsdFrame(item.file);
            break;
          case "eps":
            result = await extractEpsFrame(item.file);
            break;
          default:
            result = await readImageAsBase64(item.file);
        }
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  thumbUrl: result.thumbUrl,
                  base64: result.base64,
                  mimeType: result.mimeType,
                  preview: {
                    status: "ready",
                    thumbUrl: result.thumbUrl,
                    mimeType: result.mimeType,
                  },
                }
              : q,
          ),
        );
      } catch (e) {
        const isPreviewIssue = e.message?.startsWith("eps_");
        const label = isPreviewIssue
          ? "no_preview_available"
          : "frame_extract_failed";
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  status: isPreviewIssue ? "queued" : "needs_retry",
                  error: label,
                  preview: {
                    status: "error",
                    thumbUrl: q.preview?.thumbUrl || q.thumbUrl || null,
                    mimeType: q.preview?.mimeType || q.mimeType || null,
                  },
                }
              : q,
          ),
        );
      }
    });
  }

  async function runBatch() {
    setProcessing(true);
    const pending = queue.filter(
      (q) => q.status === "queued" && (q.base64 || q.kind === "eps"),
    );
    let idx = 0;

    async function worker() {
      while (idx < pending.length) {
        const item = pending[idx++];
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "processing" } : q,
          ),
        );
        try {
          const result = await generateMetadata({
            imgBase64: item.base64,
            mimeType: item.mimeType,
            keysRef,
            setKeys,
            titleLen: settings.titleLen,
            descLen: settings.descLen,
            kwCount: settings.kwCount,
            customPrompt: settings.customPrompt,
            platform: settings.platform,
          });
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    status: "done",
                    title: result.title,
                    description: result.description,
                    keywords: result.keywords || [],
                  }
                : q,
            ),
          );
        } catch (e) {
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id
                ? {
                    ...q,
                    status: "needs_retry",
                    error: e.message || "generation_failed",
                  }
                : q,
            ),
          );
        }
      }
    }

    const workers = Array.from(
      { length: Math.min(settings.concurrency, pending.length || 1) },
      worker,
    );
    await Promise.all(workers);
    setProcessing(false);
  }

  function retryItem(id) {
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "queued" } : q)),
    );
  }

  function downloadCsv(platformId = csvPlatform) {
    const done = queue.filter((q) => q.status === "done");
    if (done.length === 0) return;

    const schema = csvSchemas[platformId] || csvSchemas.general;
    const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
    const header = `${schema.headers.join(",")}\n`;
    const rows = done.map((item) =>
      schema
        .buildRow(item)
        .map((value) => esc(value))
        .join(","),
    );
    const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `metadata_${platformId}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowCsvPicker(false);
  }

  const doneCount = queue.filter((q) => q.status === "done").length;
  const queuedCount = queue.filter((q) => q.status === "queued").length;
  const retryCount = queue.filter((q) => q.status === "needs_retry").length;
  const canGenerate = keys.length > 0 && queuedCount > 0 && !processing;

  return (
    <div style={{ maxWidth: 980 }}>
      {keys.length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background:
              "linear-gradient(90deg, var(--safelight-dim), transparent)",
            border: "1px solid #4a2418",
            borderRadius: 10,
            padding: "11px 16px",
            marginBottom: 20,
            fontSize: 13,
            color: "#ffb499",
          }}
        >
          👉 Please add your Gemini API key to get started
        </div>
      )}

      <h1
        style={{
          fontSize: 25,
          fontWeight: 700,
          margin: "0 0 22px",
          letterSpacing: "-0.01em",
        }}
      >
        AI Metadata Generator for Stock & Microstock
      </h1>

      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontWeight: 700,
              fontSize: 14.5,
            }}
          >
            <UploadCloud size={17} color="var(--safelight)" /> Upload Workspace
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setSettings((s) => ({ ...s, platform: p.id }))}
                  style={{
                    padding: "6px 13px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid ${settings.platform === p.id ? "var(--safelight)" : "var(--line)"}`,
                    background:
                      settings.platform === p.id
                        ? "rgba(255,106,61,0.12)"
                        : "var(--bg-inset)",
                    color:
                      settings.platform === p.id
                        ? "var(--safelight)"
                        : "var(--text-dim)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {Icon && <Icon size={14} color={p.color} />}
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              onFiles(e.dataTransfer.files);
            }}
            style={{
              border: `1.5px dashed ${dragOver ? "var(--safelight)" : "var(--line-bright)"}`,
              borderRadius: 12,
              padding: "46px 20px",
              textAlign: "center",
              cursor: "pointer",
              background: dragOver
                ? "rgba(255,106,61,0.05)"
                : "var(--bg-inset)",
              transition: "all .15s",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 18,
                marginBottom: 16,
                color: "var(--text-faint)",
              }}
            >
              <ImageIcon size={20} />
              <Film size={20} />
              <FileText size={20} />
              <Shapes size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>
              Supported: JPG, PNG, GIF, MP4, MOV, SVG, EPS, AI, PDF
            </div>
            <div
              style={{
                color: "var(--text-faint)",
                fontSize: 12.5,
                marginTop: 5,
              }}
            >
              Drag files here or tap to browse
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.ai,.psd,.eps,application/pdf,application/postscript,image/vnd.adobe.photoshop"
              style={{ display: "none" }}
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12.5,
                color: "var(--text-dim)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: processing ? "var(--dev)" : "var(--fix)",
                }}
              />
              {processing
                ? `Generating… ${doneCount + retryCount}/${queue.length}`
                : "System Ready"}
              {queue.length > 0 && (
                <span className="mono" style={{ color: "var(--text-faint)" }}>
                  {" "}
                  · {queuedCount} queued · {retryCount} retry
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 9,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <button onClick={() => setQueue([])} style={ghostBtn}>
                <Trash2 size={14} /> Clear
              </button>
              <button
                onClick={runBatch}
                disabled={!canGenerate}
                style={{ ...accentBtn, opacity: canGenerate ? 1 : 0.4 }}
              >
                <Wand2 size={14} />{" "}
                {processing ? "Generating…" : "Generate Batch"}
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => {
                    if (doneCount > 0) {
                      setShowCsvPicker((value) => !value);
                    }
                  }}
                  disabled={doneCount === 0}
                  style={{ ...greenBtn, opacity: doneCount ? 1 : 0.4 }}
                >
                  <Download size={14} /> Download CSV
                </button>
                {showCsvPicker && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg-inset)",
                    }}
                  >
                    <select
                      value={csvPlatform}
                      onChange={(e) => setCsvPlatform(e.target.value)}
                      style={{
                        background: "var(--bg-raised)",
                        color: "var(--text)",
                        border: "1px solid var(--line)",
                        borderRadius: 8,
                        padding: "7px 9px",
                      }}
                    >
                      {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => downloadCsv(csvPlatform)}
                      style={greenBtn}
                    >
                      Export
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)" }}>
          {queue.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "54px 20px",
                color: "var(--text-faint)",
                fontSize: 13,
              }}
            >
              No files in queue. Upload files to start.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
                padding: 18,
              }}
            >
              {queue.map((item) => (
                <ResultCard key={item.id} item={item} onRetry={retryItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnBase = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "none",
  borderRadius: 8,
  padding: "9px 15px",
  fontWeight: 700,
  fontSize: 12.5,
  cursor: "pointer",
};
const accentBtn = {
  ...btnBase,
  background: "var(--safelight)",
  color: "#1a0d06",
};
const greenBtn = { ...btnBase, background: "var(--fix)", color: "#0a2018" };
const ghostBtn = {
  ...btnBase,
  background: "var(--bg-inset)",
  color: "var(--text)",
  border: "1px solid var(--line)",
};
const rowBtn = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "none",
  border: "none",
  color: "var(--safelight)",
  fontSize: 11,
  cursor: "pointer",
  fontWeight: 600,
};
