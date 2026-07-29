import { PROVIDERS } from '../lib/providers/index';
import { useState } from 'react';
import { X, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useAppState } from '../store/AppState';

const statusColor = { ok: 'var(--fix)', limited: 'var(--dev)', dead: 'var(--stop)' };
const statusLabel = { ok: 'ready', limited: 'cooling', dead: 'spent' };

export default function KeyModal({ onClose }) {
  const { keys, setKeys } = useAppState();
  const [input, setInput] = useState('');
  const [provider, setProvider] = useState('gemini');

  const providerMeta = PROVIDERS[provider];
  const providerLabel = providerMeta?.label || 'Provider';
  const providerCopy = provider === 'gemini'
    ? 'Add one or more free keys from aistudio.google.com/app/apikey. Keys stay in this browser tab only — every request goes straight from here to Google.'
    : `Add one or more API keys for ${providerLabel}. Keys stay in this browser tab only — every request goes straight from here to ${providerLabel}.`;

  function addKey() {
    const v = input.trim();
    if (!v) return;
    setKeys(prev => [...prev, { id: crypto.randomUUID(), value: v, status: 'ok', provider }]);
    setInput('');
  }
  function removeKey(id) {
    setKeys(prev => prev.filter(k => k.id !== id));
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(8,6,5,0.7)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 460, background: 'var(--bg-raised)',
        border: '1px solid var(--line-bright)', borderRadius: 14, padding: 22,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyRound size={16} color="var(--safelight)" />
            <h2 style={{ fontSize: 15, margin: 0, fontWeight: 700 }}>{providerLabel} API keys</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5, margin: '0 0 14px' }}>
          {provider === 'gemini' ? (
            <>Add one or more free keys from <span className="mono">aistudio.google.com/app/apikey</span>. Keys stay in this browser tab only — every request goes straight from here to Google.</>
          ) : (
            <>Add one or more API keys for {providerLabel}. Keys stay in this browser tab only — every request goes straight from here to {providerLabel}.</>
          )}
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
  <select value={provider} onChange={e => setProvider(e.target.value)} style={{
    background: 'var(--bg-inset)', border: '1px solid var(--line)', color: 'var(--text)',
    padding: '10px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer'
  }}>
    {Object.entries(PROVIDERS).map(([id, p]) => (
      <option key={id} value={id}>{p.label}</option>
    ))}
  </select>
  <input
    className="mono"
    type="password"
    placeholder="Paste API key…"
    value={input}
    onChange={e => setInput(e.target.value)}
    onKeyDown={e => e.key === 'Enter' && addKey()}
    style={{
      flex: 1, background: 'var(--bg-inset)', border: '1px solid var(--line)', color: 'var(--text)',
      padding: '10px 12px', borderRadius: 8, fontSize: 13
    }}
  />
  <button onClick={addKey} style={{
    display: 'flex', alignItems: 'center', gap: 6, background: 'var(--safelight)', color: '#1a0d06',
    border: 'none', borderRadius: 8, padding: '0 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer'
  }}>
    <Plus size={15} /> Add
  </button>
</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
          {keys.length === 0 && (
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--text-faint)', padding: '8px 0' }}>No keys added yet.</div>
          )}
          {keys.map(k => (
            <div key={k.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--bg-inset)', border: '1px solid var(--line)', borderRadius: 8, padding: '8px 10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, overflow: 'hidden' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: statusColor[k.status], flexShrink: 0 }} />
                <span className="mono" style={{ fontSize: 12, color: 'var(--text-dim)' }}>{k.value.slice(0, 8)}••••••{k.value.slice(-4)}</span>
                <span className="mono" style={{ fontSize: 9.5, color: 'var(--text-faint)', textTransform: 'uppercase' }}>{PROVIDERS[k.provider]?.label}</span>
              </div>
              <button onClick={() => removeKey(k.id)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.5 }}>
          Add more than one to build a pool — if a key hits its rate limit mid-batch, generation quietly rotates to the next one.
        </div>
      </div>
    </div>
  );
}
