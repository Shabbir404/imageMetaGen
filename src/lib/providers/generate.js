import { PROVIDERS } from "./index";

function nextAvailableKey(keysRef, setKeys, excludeIds = []) {
  const current = keysRef.current;
  const candidates = current.filter(
    (k) => k.status !== "dead" && !excludeIds.includes(k.id),
  );
  if (candidates.length === 0) return null;
  const chosen = candidates[0];
  const rotated = [...current.filter((k) => k.id !== chosen.id), chosen];
  keysRef.current = rotated;
  setKeys(rotated);
  return chosen;
}

function markKeyStatus(keysRef, setKeys, id, status) {
  const updated = keysRef.current.map((k) =>
    k.id === id ? { ...k, status } : k,
  );
  keysRef.current = updated;
  setKeys(updated);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function generateMetadata({
  imgBase64,
  keysRef,
  setKeys,
  titleLen,
  descLen,
  kwCount,
  customPrompt,
}) {
  const excluded = [];
  let lastErr = null;
  const maxAttempts = Math.min(6, Math.max(2, keysRef.current.length * 2));
  const opts = { titleLen, descLen, kwCount, customPrompt };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = nextAvailableKey(keysRef, setKeys, excluded);
    if (!key) {
      lastErr = "no_keys_available";
      break;
    }

    const provider = PROVIDERS[key.provider];
    if (!provider) {
      excluded.push(key.id);
      continue;
    }

    try {
      const result = await provider.call(imgBase64, key.value, {
        ...opts,
        model: key.model,
      });
      markKeyStatus(keysRef, setKeys, key.id, "ok");
      return result;
    } catch (e) {
      const status = e.status;
      if (status === 429) {
        markKeyStatus(keysRef, setKeys, key.id, "limited");
        excluded.push(key.id);
        await sleep(300 * (attempt + 1));
        continue;
      }
      if (status === 401 || status === 403) {
        markKeyStatus(keysRef, setKeys, key.id, "dead");
        excluded.push(key.id);
        continue;
      }
      // cors_or_network or any other transient failure: don't kill the key,
      // just back off and try again (possibly a different key next loop)
      lastErr = e.message;
      excluded.push(key.id);
      await sleep(300 * (attempt + 1));
    }
  }

  throw new Error(lastErr || "exhausted_retries");
}
