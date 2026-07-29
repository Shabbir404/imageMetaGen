import { Aperture, KeyRound, ExternalLink } from "lucide-react";
import { useAppState } from "../store/AppState";

export default function Navbar() {
  const { keys, queue } = useAppState();
  const doneCount = queue.filter((q) => q.status === "done").length;

  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-raised)",
        flexShrink: 0,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 22px",
      }}
    >
      {/* brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "linear-gradient(135deg, var(--safelight), #d9481f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(167,139,250,0.28)",
            }}
          >
            <Aperture size={16} color="#1a0d06" strokeWidth={2.5} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
              }}
            >
              MetaGen
            </div>
            <div
              className="mono"
              style={{
                fontSize: 9.5,
                color: "var(--text-faint)",
                letterSpacing: ".08em",
              }}
            >
              Free AI meta data genaretor
            </div>
          </div>
        </div>

        {/* nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <NavItem label="Workspace" active />
          <NavItem label="Docs" />
          <NavItem label="Pricing" />
        </nav>
      </div>

      {/* right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-dim)",
            textDecoration: "none",
            border: "1px solid var(--line)",
            borderRadius: 20,
            padding: "6px 12px",
          }}
        >
          <KeyRound size={12} /> Get a free key <ExternalLink size={11} />
        </a>

        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--text-dim)",
            display: "flex",
            gap: 16,
          }}
        >
          <span>
            <b style={{ color: "var(--text)" }}>{keys.length}</b> key
            {keys.length !== 1 ? "s" : ""}
          </span>
          <span>
            <b style={{ color: "var(--fix)" }}>{doneCount}</b> generated
          </span>
        </div>
      </div>
    </header>
  );
}

function NavItem({ label, active }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{
        padding: "7px 14px",
        borderRadius: 7,
        fontSize: 13,
        fontWeight: 600,
        textDecoration: "none",
        color: active ? "var(--text)" : "var(--text-dim)",
        background: active ? "var(--bg-inset)" : "transparent",
        border: active
          ? "1px solid var(--line-bright)"
          : "1px solid transparent",
      }}
    >
      {label}
    </a>
  );
}
