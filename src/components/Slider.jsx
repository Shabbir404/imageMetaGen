export default function Slider({ label, value, min, max, onChange, suffix = '' }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12.5, color: 'var(--text-dim)', fontWeight: 500 }}>{label}</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--safelight)', fontWeight: 600 }}>{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(+e.target.value)}
        style={{
          '--pct': `${pct}%`,
          width: '100%',
          appearance: 'none',
          WebkitAppearance: 'none',
          height: 4,
          borderRadius: 3,
          background: `linear-gradient(to right, var(--safelight) 0%, var(--safelight) var(--pct), var(--line) var(--pct), var(--line) 100%)`,
          outline: 'none',
          cursor: 'pointer',
        }}
        className="slider-input"
      />
    </div>
  );
}
