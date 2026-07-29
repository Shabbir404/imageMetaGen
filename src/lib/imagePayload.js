export function normalizeImagePayload(input, fallbackMimeType = "image/png") {
  if (!input || typeof input !== "string") {
    return { thumbUrl: null, base64: null, mimeType: fallbackMimeType };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return { thumbUrl: null, base64: null, mimeType: fallbackMimeType };
  }

  if (trimmed.startsWith("data:")) {
    const commaIndex = trimmed.indexOf(",");
    if (commaIndex <= 0) {
      return { thumbUrl: null, base64: null, mimeType: fallbackMimeType };
    }

    const metadata = trimmed.slice(0, commaIndex);
    const base64 = trimmed.slice(commaIndex + 1).trim();
    const mimeTypeMatch = metadata.match(/^data:(.+?)(;|$)/);
    const mimeType = mimeTypeMatch?.[1] || fallbackMimeType;

    if (!base64) {
      return { thumbUrl: null, base64: null, mimeType };
    }

    return { thumbUrl: trimmed, base64, mimeType };
  }

  const base64 = trimmed.replace(/\s+/g, "");
  if (!base64) {
    return { thumbUrl: null, base64: null, mimeType: fallbackMimeType };
  }

  return {
    thumbUrl: `data:${fallbackMimeType};base64,${base64}`,
    base64,
    mimeType: fallbackMimeType,
  };
}

export function canvasToImagePayload(canvas, mimeType = "image/png", quality) {
  const dataUrl = canvas.toDataURL(mimeType, quality);
  return normalizeImagePayload(dataUrl, mimeType);
}
