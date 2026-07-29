import { Link } from "react-router-dom";
import { seoPages } from "../data/seoPages";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--bg-raised)",
        padding: "36px 28px 40px",
        marginTop: 40,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--text-faint)",
            textTransform: "uppercase",
            letterSpacing: ".07em",
            marginBottom: 14,
          }}
        >
          Guides & resources
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "8px 24px",
          }}
        >
          {seoPages.map((p) => (
            <Link
              key={p.slug}
              to={`/guides/${p.slug}`}
              style={{
                fontSize: 12.5,
                color: "var(--text-dim)",
                textDecoration: "none",
                padding: "3px 0",
              }}
            >
              {p.navLabel}
            </Link>
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--line)",
            fontSize: 11.5,
            color: "var(--text-faint)",
          }}
        >
          MetaGen — AI metadata generator for stock and microstock contributors.
        </div>
      </div>
    </footer>
  );
}
