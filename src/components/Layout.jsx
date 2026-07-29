import { Outlet } from 'react-router-dom';
import { Aperture } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAppState } from '../store/AppState';

export default function Layout() {
  const { keys, queue } = useAppState();
  const doneCount = queue.filter(q => q.status === 'done').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{
        borderBottom: '1px solid var(--line)', background: 'var(--bg-raised)',
        flexShrink: 0, height: 60, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg, var(--safelight), #d9481f)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255,106,61,0.4)'
          }}>
            <Aperture size={16} color="#1a0d06" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em', lineHeight: 1.1 }}>MetaGen</div>
            <div className="mono" style={{ fontSize: 9.5, color: 'var(--text-faint)', letterSpacing: '.08em' }}>
              AI METADATA GENERATOR
            </div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', gap: 16 }}>
          <span><b style={{ color: 'var(--text)' }}>{keys.length}</b> key{keys.length !== 1 ? 's' : ''}</span>
          <span><b style={{ color: 'var(--fix)' }}>{doneCount}</b> generated</span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 28px 80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
