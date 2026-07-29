import { useState } from 'react';
import { KeyRound, Sparkles } from 'lucide-react';
import { useAppState } from '../store/AppState';
import Slider from './Slider';
import KeyModal from './KeyModal';

const speedOptions = [
  { value: '1x-careful', label: '1x (Careful)', concurrency: 3 },
  { value: '2x-fast', label: '2x (Fast)', concurrency: 6 },
  { value: '3x-turbo', label: '3x (Turbo)', concurrency: 10 },
];

export default function Sidebar() {
  const { keys, settings, setSettings } = useAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const readyKeys = keys.filter(k => k.status !== 'dead').length;

  return (
    <aside style={{
      width: 292, flexShrink: 0, borderRight: '1px solid var(--line)',
      background: 'var(--bg-raised)', padding: '22px 20px', height: '100%', overflowY: 'auto'
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.09em', color: 'var(--text-faint)', marginBottom: 14 }}>
        CONFIGURATION
      </div>

      <button onClick={() => setModalOpen(true)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'linear-gradient(135deg, var(--safelight), #d9481f)', color: '#1a0d06',
        border: 'none', borderRadius: 10, padding: '11px 0', fontWeight: 700, fontSize: 13.5,
        cursor: 'pointer', marginBottom: 8, boxShadow: '0 6px 18px rgba(255,106,61,0.25)'
      }}>
        <KeyRound size={15} /> Add API Keys
      </button>
      <div className="mono" style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 22, textAlign: 'center' }}>
        {keys.length === 0 ? 'no keys loaded' : `${readyKeys} of ${keys.length} ready`}
      </div>

      <Slider label="Title Length" value={settings.titleLen} min={20} max={200}
        onChange={v => setSettings(s => ({ ...s, titleLen: v }))} />
      <Slider label="Description Length" value={settings.descLen} min={40} max={400}
        onChange={v => setSettings(s => ({ ...s, descLen: v }))} />
      <Slider label="Keywords Count" value={settings.kwCount} min={5} max={49}
        onChange={v => setSettings(s => ({ ...s, kwCount: v }))} />

      <Field label="Content Type">
        <select value={settings.contentType} onChange={e => setSettings(s => ({ ...s, contentType: e.target.value }))} style={selectStyle}>
          <option value="auto">None (Auto)</option>
          <option value="photo">Photo</option>
          <option value="illustration">Illustration</option>
          <option value="vector">Vector</option>
          <option value="video">Video</option>
        </select>
      </Field>

      <Field label="Processing Speed">
        <select
          value={settings.processingSpeed}
          onChange={e => {
            const opt = speedOptions.find(o => o.value === e.target.value);
            setSettings(s => ({ ...s, processingSpeed: opt.value, concurrency: opt.concurrency }));
          }}
          style={selectStyle}
        >
          {speedOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </Field>

      <div style={{ marginTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-dim)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} color="var(--safelight)" /> Custom System Prompt
          </span>
        </div>
        <textarea
          placeholder="E.g., Write in a warm tone, focus on emotion and mood…"
          value={settings.customPrompt}
          onChange={e => setSettings(s => ({ ...s, customPrompt: e.target.value }))}
          rows={4}
          style={{
            width: '100%', background: 'var(--bg-inset)', border: '1px solid var(--line)', color: 'var(--text)',
            padding: '10px 12px', borderRadius: 8, fontSize: 12.5, lineHeight: 1.5
          }}
        />
        {settings.customPrompt && (
          <button onClick={() => setSettings(s => ({ ...s, customPrompt: '' }))} style={{
            background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: 11, cursor: 'pointer', marginTop: 6, padding: 0
          }}>
            Reset to default
          </button>
        )}
      </div>

      {modalOpen && <KeyModal onClose={() => setModalOpen(false)} />}
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-dim)', fontWeight: 500, marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

const selectStyle = {
  width: '100%', background: 'var(--bg-inset)', border: '1px solid var(--line)', color: 'var(--text)',
  padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
};
