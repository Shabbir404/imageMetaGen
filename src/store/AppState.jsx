import { createContext, useContext, useState, useRef, useEffect } from 'react';

const Ctx = createContext(null);

export function AppStateProvider({ children }) {
  const [keys, setKeys] = useState([]);
  const [queue, setQueue] = useState([]);
  const [settings, setSettings] = useState({
    concurrency: 6,
    processingSpeed: '2x-fast',
    titleLen: 80,
    descLen: 160,
    kwCount: 25,
    contentType: 'auto',
    platform: 'general',
    customPrompt: ''
  });

  // Concurrent batch workers need to see key-status changes immediately,
  // not wait for the next React re-render — keysRef always holds the latest array.
  const keysRef = useRef(keys);
  useEffect(() => { keysRef.current = keys; }, [keys]);

  const value = { keys, setKeys, keysRef, queue, setQueue, settings, setSettings };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
