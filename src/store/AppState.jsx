import { createContext, useContext, useState, useRef, useEffect } from "react";

const Ctx = createContext(null);
const KEYS_STORAGE = "metagen_keys_v1";
const SETTINGS_STORAGE = "metagen_settings_v1";

function loadKeys() {
  try {
    const raw = localStorage.getItem(KEYS_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // status is transient (rate-limit state from last session is stale) —
    // reset everything to 'ok' on load so a key that got marked 'limited'
    // or 'dead' yesterday gets a fair shot again today
    return parsed.map((k) => ({ ...k, status: "ok" }));
  } catch {
    return [];
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const defaultSettings = {
  concurrency: 6,
  processingSpeed: "2x-fast",
  titleLen: 80,
  descLen: 160,
  kwCount: 25,
  contentType: "auto",
  platform: "general",
  customPrompt: "",
};

export function AppStateProvider({ children }) {
  const [keys, setKeys] = useState(loadKeys);
  const [queue, setQueue] = useState([]);
  const [settings, setSettings] = useState(() => ({
    ...defaultSettings,
    ...loadSettings(),
  }));

  const keysRef = useRef(keys);
  useEffect(() => {
    keysRef.current = keys;
    try {
      // don't persist the file objects in queue (that's queue, not keys) —
      // only ever writing the keys array here
      localStorage.setItem(KEYS_STORAGE, JSON.stringify(keys));
    } catch {}
  }, [keys]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const value = {
    keys,
    setKeys,
    keysRef,
    queue,
    setQueue,
    settings,
    setSettings,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}
