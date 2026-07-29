import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { seoPages } from "../data/seoPages";

export default function GuidePage() {
  const { slug } = useParams();
  const page = seoPages.find((p) => p.slug === slug);

  useEffect(() => {
    if (page) {
      document.title = `${page.metaTitle} · MetaGen`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = page.metaDescription;
    }
  }, [page]);

  if (!page) return <Navigate to="/" replace />;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "10px 4px 60px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            margin: "0 0 10px",
            letterSpacing: "-0.015em",
            lineHeight: 1.25,
          }}
        >
          {page.title}
        </h1>
        {page.subtitle && (
          <p
            style={{
              fontSize: 15,
              color: "var(--text-dim)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {page.subtitle}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {page.sections.map((s, i) => (
          <Section key={i} s={s} />
        ))}
      </div>

      <div
        style={{
          marginTop: 44,
          padding: 22,
          borderRadius: 14,
          background:
            "linear-gradient(135deg, var(--safelight-dim), var(--bg-raised))",
          border: "1px solid var(--line-bright)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={18} color="var(--safelight)" />
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            Try it on your own files — free, no signup.
          </div>
        </div>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--safelight)",
            color: "#1a1522",
            padding: "9px 16px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Open Workspace <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function Section({ s }) {
  if (s.type === "h2") {
    return (
      <h2
        style={{
          fontSize: 19,
          fontWeight: 700,
          margin: "10px 0 -6px",
          letterSpacing: "-0.01em",
        }}
      >
        {s.content}
      </h2>
    );
  }
  if (s.type === "p") {
    return (
      <p
        style={{
          fontSize: 14,
          color: "var(--text-dim)",
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        {s.content}
      </p>
    );
  }
  if (s.type === "ul") {
    return (
      <div>
        {s.heading && (
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>
            {s.heading}
          </h3>
        )}
        <ul
          style={{
            margin: 0,
            paddingLeft: 20,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {s.items.map((it, i) => (
            <li
              key={i}
              style={{
                fontSize: 13.5,
                color: "var(--text-dim)",
                lineHeight: 1.6,
              }}
            >
              {it}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (s.type === "specs") {
    return (
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 12,
          overflow: "hidden",
          background: "var(--bg-raised)",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: s.color,
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 14.5 }}>{s.platform}</span>
        </div>
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <p
            style={{
              fontSize: 12.5,
              color: "var(--text-faint)",
              fontStyle: "italic",
              margin: 0,
            }}
          >
            {s.note}
          </p>
          <SpecBlock label="Title rules" items={s.titleRules} />
          <SpecBlock label="Keyword rules" items={s.keywordRules} />
        </div>
      </div>
    );
  }
  if (s.type === "faq") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.items.map((f, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 10,
              padding: 14,
              background: "var(--bg-raised)",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>
              {f.q}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--text-dim)",
                lineHeight: 1.6,
              }}
            >
              {f.a}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function SpecBlock({ label, items }) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 10.5,
          color: "var(--text-faint)",
          textTransform: "uppercase",
          letterSpacing: ".06em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 18,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
