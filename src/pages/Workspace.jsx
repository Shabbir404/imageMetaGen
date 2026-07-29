import { useRef, useState } from 'react';
import {
  UploadCloud, Image as ImageIcon, Film, FileText, Shapes,
  Trash2, Wand2, Download, RotateCcw, CheckCircle2
} from 'lucide-react';
import { useAppState } from '../store/AppState';
import { extractVideoFrame, readImageAsBase64 } from '../lib/videoFrame';
import { generateMetadata } from '../lib/providers/gemini';

const platforms = [
  { id: 'general', label: 'General' },
  { id: 'adobe', label: 'Adobe' },
  { id: 'shutterstock', label: 'Shutter' },
  { id: 'istock', label: 'iStock' },
  { id: 'getty', label: 'Getty' },
  { id: 'pond5', label: 'Pond5' },
  { id: 'vecteezy', label: 'Vecteezy' },
  { id: 'freepik', label: 'Freepik' },
];

const badgeStyle = {
  queued:      { bg: '#1c1815', fg: 'var(--text-faint)', label: 'Queued' },
  processing:  { bg: '#2a2013', fg: 'var(--dev)', label: 'Generating' },
  done:        { bg: '#132420', fg: 'var(--fix)', label: 'Done' },
  needs_retry: { bg: '#2a1315', fg: 'var(--stop)', label: 'Needs retry' },
};

export default function Workspace() {
  const { keys, setKeys, keysRef, queue, setQueue, settings, setSettings } = useAppState();
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);

  function onFiles(fileList) {
    const items = Array.from(fileList).map(file => ({
      id: crypto.randomUUID(),
      file,
      kind: file.type.startsWith('video') ? 'video' : 'image',
      thumbUrl: null, base64: null,
      status: 'queued', title: '', description: '', keywords: [], error: null
    }));
    setQueue(prev => [...prev, ...items]);

    items.forEach(async item => {
      try {
        const { thumbUrl, base64 } = item.kind === 'video'
          ? await extractVideoFrame(item.file)
          : await readImageAsBase64(item.file);
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, thumbUrl, base64 } : q));
      } catch {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'needs_retry', error: 'frame_extract_failed' } : q));
      }
    });
  }

  async function runBatch() {
    setProcessing(true);
    const pending = queue.filter(q => q.status === 'queued' && q.base64);
    let idx = 0;

    async function worker() {
      while (idx < pending.length) {
        const item = pending[idx++];
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q));
        try {
          const result = await generateMetadata({
            imgBase64: item.base64, keysRef, setKeys,
            titleLen: settings.titleLen, descLen: settings.descLen, kwCount: settings.kwCount,
            customPrompt: settings.customPrompt
          });
          setQueue(prev => prev.map(q => q.id === item.id
            ? { ...q, status: 'done', title: result.title, description: result.description, keywords: result.keywords || [] }
            : q));
        } catch (e) {
          setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'needs_retry', error: e.message } : q));
        }
      }
    }

    const workers = Array.from({ length: Math.min(settings.concurrency, pending.length || 1) }, worker);
    await Promise.all(workers);
    setProcessing(false);
  }

  function retryItem(id) {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'queued' } : q));
  }

  function downloadCsv() {
    const done = queue.filter(q => q.status === 'done');
    const esc = s => `"${(s || '').replace(/"/g, '""')}"`;
    const header = 'Filename,Title,Description,Keywords\n';
    const rows = done.map(item => [esc(item.file.name), esc(item.title), esc(item.description), esc(item.keywords.join(', '))].join(','));
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `metadata_${settings.platform}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const doneCount = queue.filter(q => q.status === 'done').length;
  const queuedCount = queue.filter(q => q.status === 'queued').length;
  const retryCount = queue.filter(q => q.status === 'needs_retry').length;
  const canGenerate = keys.length > 0 && queuedCount > 0 && !processing;

  return (
    <div style={{ maxWidth: 980 }}>
      {keys.length === 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(90deg, var(--safelight-dim), transparent)',
          border: '1px solid #4a2418', borderRadius: 10, padding: '11px 16px', marginBottom: 20,
          fontSize: 13, color: '#ffb499'
        }}>
          👉 Please add your Gemini API key to get started
        </div>
      )}

      <h1 style={{ fontSize: 25, fontWeight: 700, margin: '0 0 22px', letterSpacing: '-0.01em' }}>
        AI Metadata Generator for Stock & Microstock
      </h1>

      <div style={{
        background: 'var(--bg-raised)', border: '1px solid var(--line)', borderRadius: 16,
        overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          padding: '16px 20px', borderBottom: '1px solid var(--line)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14.5 }}>
            <UploadCloud size={17} color="var(--safelight)" /> Upload Workspace
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {platforms.map(p => (
              <button
                key={p.id}
                onClick={() => setSettings(s => ({ ...s, platform: p.id }))}
                style={{
                  padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${settings.platform === p.id ? 'var(--safelight)' : 'var(--line)'}`,
                  background: settings.platform === p.id ? 'rgba(255,106,61,0.12)' : 'var(--bg-inset)',
                  color: settings.platform === p.id ? 'var(--safelight)' : 'var(--text-dim)',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
            style={{
              border: `1.5px dashed ${dragOver ? 'var(--safelight)' : 'var(--line-bright)'}`,
              borderRadius: 12, padding: '46px 20px', textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(255,106,61,0.05)' : 'var(--bg-inset)', transition: 'all .15s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 16, color: 'var(--text-faint)' }}>
              <ImageIcon size={20} /><Film size={20} /><FileText size={20} /><Shapes size={20} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>Supported: JPG, PNG, GIF, MP4, MOV, SVG, EPS, AI, PDF</div>
            <div style={{ color: 'var(--text-faint)', fontSize: 12.5, marginTop: 5 }}>Drag files here or tap to browse</div>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }}
              onChange={e => onFiles(e.target.files)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-dim)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: processing ? 'var(--dev)' : 'var(--fix)' }} />
              {processing ? `Generating… ${doneCount + retryCount}/${queue.length}` : 'System Ready'}
              {queue.length > 0 && <span className="mono" style={{ color: 'var(--text-faint)' }}> · {queuedCount} queued · {retryCount} retry</span>}
            </div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={() => setQueue([])} style={ghostBtn}><Trash2 size={14} /> Clear</button>
              <button onClick={runBatch} disabled={!canGenerate} style={{ ...accentBtn, opacity: canGenerate ? 1 : 0.4 }}>
                <Wand2 size={14} /> {processing ? 'Generating…' : 'Generate Batch'}
              </button>
              <button onClick={downloadCsv} disabled={doneCount === 0} style={{ ...greenBtn, opacity: doneCount ? 1 : 0.4 }}>
                <Download size={14} /> Download CSV
              </button>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)' }}>
          {queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '54px 20px', color: 'var(--text-faint)', fontSize: 13 }}>
              No files in queue. Upload files to start.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', padding: 12, gap: 8 }}>
              {queue.map(item => {
                const b = badgeStyle[item.status];
                return (
                  <div key={item.id} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    background: 'var(--bg-inset)', border: '1px solid var(--line)', borderRadius: 10, padding: 10
                  }}>
                    {item.thumbUrl
                      ? <img src={item.thumbUrl} style={{ width: 48, height: 48, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 48, height: 48, borderRadius: 7, background: 'var(--bg)', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span className="mono" style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                          {item.file.name}
                        </span>
                        <span className="mono" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: b.bg, color: b.fg, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          {item.status === 'done' && <CheckCircle2 size={10} />} {b.label}
                        </span>
                        {item.status === 'needs_retry' && (
                          <button onClick={() => retryItem(item.id)} style={rowBtn}><RotateCcw size={11} /> retry</button>
                        )}
                      </div>
                      {item.status === 'done' ? (
                        <>
                          <div style={{ fontSize: 12.5, color: 'var(--text)' }}>{item.title}</div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>{item.description}</div>
                          <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {item.keywords.slice(0, 10).map((k, i) => (
                              <span key={i} className="mono" style={{ fontSize: 10, background: 'var(--bg)', color: 'var(--text-dim)', padding: '2px 7px', borderRadius: 10 }}>{k}</span>
                            ))}
                            {item.keywords.length > 10 && <span className="mono" style={{ fontSize: 10, color: 'var(--text-faint)' }}>+{item.keywords.length - 10} more</span>}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 11.5, color: 'var(--text-faint)' }}>
                          {item.kind === 'video' ? 'frame captured from video' : 'ready'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const btnBase = { display: 'flex', alignItems: 'center', gap: 6, border: 'none', borderRadius: 8, padding: '9px 15px', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' };
const accentBtn = { ...btnBase, background: 'var(--safelight)', color: '#1a0d06' };
const greenBtn = { ...btnBase, background: 'var(--fix)', color: '#0a2018' };
const ghostBtn = { ...btnBase, background: 'var(--bg-inset)', color: 'var(--text)', border: '1px solid var(--line)' };
const rowBtn = { display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', color: 'var(--safelight)', fontSize: 11, cursor: 'pointer', fontWeight: 600 };
