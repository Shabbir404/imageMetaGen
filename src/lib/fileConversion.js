import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { readPsd } from "ag-psd";
import { canvasToImagePayload } from "./imagePayload";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function detectFileKind(file) {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("video")) return "video";
  if (name.endsWith(".psd")) return "psd";
  if (name.endsWith(".eps")) return "eps";
  if (
    name.endsWith(".ai") ||
    name.endsWith(".pdf") ||
    file.type === "application/pdf"
  )
    return "pdf";
  if (file.type.startsWith("image")) return "image";
  return "unsupported";
}

async function canvasToJpeg(canvas) {
  return canvasToImagePayload(canvas, "image/png");
}

// PDF and AI (AI files are PDF-compatible) — render page 1
export async function extractPdfFrame(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext("2d"), viewport })
    .promise;
  return canvasToJpeg(canvas);
}

// PSD — extract the embedded flattened composite
export async function extractPsdFrame(file) {
  const buf = await file.arrayBuffer();
  const psd = readPsd(buf, { skipLayerImageData: true });
  if (!psd.canvas) throw new Error("psd_no_composite");
  return canvasToJpeg(psd.canvas);
}

// EPS — try to pull an embedded TIFF/preview block; otherwise signal
// there's no visual preview so the caller can fall back to filename-only.
import UTIF from "utif";
import { decodeEpsiPreviewPixels } from "./epsPreview";

export async function extractEpsFrame(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const text = new TextDecoder("latin1").decode(buf.slice(0, 220000));

  const wrapped = tryExtractWrappedPreview(buf);
  if (wrapped) return wrapped;

  const tiff = tryExtractTiffPreview(buf);
  if (tiff) return tiff;

  const ascii = tryExtractAsciiPreview(buf, text);
  if (ascii) return ascii;

  return createVectorPlaceholderPreview(file.name, text);
}

function tryExtractWrappedPreview(buf) {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const MAGIC = 0xc6d3d0c5;
  if (buf.length <= 30 || view.getUint32(0, true) !== MAGIC) return null;

  const tiffStart = view.getUint32(20, true);
  const tiffLength = view.getUint32(24, true);
  if (tiffLength <= 0 || tiffStart + tiffLength > buf.length) return null;

  const tiffBytes = buf.slice(tiffStart, tiffStart + tiffLength);
  try {
    const ab = tiffBytes.buffer.slice(
      tiffBytes.byteOffset,
      tiffBytes.byteOffset + tiffBytes.byteLength,
    );
    const ifds = UTIF.decode(ab);
    if (!ifds?.length) return null;
    UTIF.decodeImage(ab, ifds[0]);
    const rgba = UTIF.toRGBA8(ifds[0]);
    const canvas = document.createElement("canvas");
    canvas.width = ifds[0].width;
    canvas.height = ifds[0].height;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(ifds[0].width, ifds[0].height);
    imgData.data.set(rgba);
    ctx.putImageData(imgData, 0, 0);
    return canvasToImagePayload(canvas, "image/png");
  } catch {
    return null;
  }
}

function tryExtractTiffPreview(buf) {
  const signatures = [
    [0x49, 0x49, 0x2a, 0x00],
    [0x4d, 0x4d, 0x00, 0x2a],
  ];

  for (const signature of signatures) {
    const offset = findByteSequence(buf, signature);
    if (offset < 0) continue;

    try {
      const ab = buf.buffer.slice(
        buf.byteOffset + offset,
        buf.byteOffset + buf.byteLength,
      );
      const ifds = UTIF.decode(ab);
      if (!ifds?.length) continue;
      UTIF.decodeImage(ab, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const canvas = document.createElement("canvas");
      canvas.width = ifds[0].width;
      canvas.height = ifds[0].height;
      const ctx = canvas.getContext("2d");
      const imgData = ctx.createImageData(ifds[0].width, ifds[0].height);
      imgData.data.set(rgba);
      ctx.putImageData(imgData, 0, 0);
      return canvasToImagePayload(canvas, "image/png");
    } catch {
      // continue to the next strategy
    }
  }

  return null;
}

function tryExtractAsciiPreview(buf, text) {
  const previewMatch = text.match(
    /%%BeginPreview:\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/i,
  );
  if (!previewMatch) return null;

  try {
    return decodeEpsiPreview(text, previewMatch);
  } catch {
    return null;
  }
}

function createVectorPlaceholderPreview(fileName, text) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, "#17120f");
  gradient.addColorStop(1, "#3b2417");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bbox = parseBoundingBox(text);
  const boxW = bbox ? bbox.width : 600;
  const boxH = bbox ? bbox.height : 400;
  const scale = Math.min(650 / boxW, 420 / boxH, 1);
  const drawW = boxW * scale;
  const drawH = boxH * scale;
  const x = (900 - drawW) / 2;
  const y = (600 - drawH) / 2 + 20;

  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "rgba(255, 226, 188, 0.95)";
  ctx.lineWidth = 4;
  ctx.setLineDash([12, 10]);
  ctx.strokeRect(10, 10, drawW - 20, drawH - 20);
  ctx.setLineDash([]);

  ctx.strokeStyle = "#ffcb7d";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(80, drawH - 110);
  ctx.lineTo(180, 90);
  ctx.lineTo(310, drawH - 140);
  ctx.lineTo(430, 120);
  ctx.lineTo(drawW - 100, drawH - 90);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 203, 125, 0.18)";
  ctx.beginPath();
  ctx.moveTo(70, drawH - 80);
  ctx.lineTo(220, 70);
  ctx.lineTo(330, drawH - 180);
  ctx.lineTo(470, 120);
  ctx.lineTo(drawW - 90, drawH - 70);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 28px sans-serif";
  ctx.fillText("EPS / vector preview", 70, 95);

  ctx.fillStyle = "rgba(249,239,226,0.82)";
  ctx.font = "22px sans-serif";
  const label = (fileName || "vector artwork").slice(0, 34);
  ctx.fillText(label, 70, 135);

  ctx.font = "18px sans-serif";
  ctx.fillText(
    "Embedded preview unavailable — rendering vector-style placeholder",
    70,
    170,
  );

  return canvasToImagePayload(canvas, "image/png");
}

function parseBoundingBox(text) {
  const match = text.match(
    /%%BoundingBox:\s*(-?\d+)\s*(-?\d+)\s*(-?\d+)\s*(-?\d+)/i,
  );
  if (!match) return null;
  const [, x1, y1, x2, y2] = match.map(Number);
  const width = Math.max(1, Math.abs(x2 - x1));
  const height = Math.max(1, Math.abs(y2 - y1));
  return { width, height };
}

function findByteSequence(buf, seq) {
  for (let i = 0; i <= buf.length - seq.length; i++) {
    let ok = true;
    for (let j = 0; j < seq.length; j++) {
      if (buf[i + j] !== seq[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return i;
  }
  return -1;
}

function decodeTiffToJpeg(tiffBytes) {
  const ab = tiffBytes.buffer.slice(
    tiffBytes.byteOffset,
    tiffBytes.byteOffset + tiffBytes.byteLength,
  );
  const ifds = UTIF.decode(ab);
  UTIF.decodeImage(ab, ifds[0]);
  const rgba = UTIF.toRGBA8(ifds[0]);
  const canvas = document.createElement("canvas");
  canvas.width = ifds[0].width;
  canvas.height = ifds[0].height;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(ifds[0].width, ifds[0].height);
  imgData.data.set(rgba);
  ctx.putImageData(imgData, 0, 0);
  return canvasToImagePayload(canvas, "image/png");
}

function decodeEpsiPreview(text, match) {
  const w = Number(match[1]),
    h = Number(match[2]),
    depth = Number(match[3]);
  const start = text.indexOf(match[0]) + match[0].length;
  const end = text.indexOf("%%EndPreview");
  const hexPayload = end === -1 ? text.slice(start) : text.slice(start, end);
  const pixels = decodeEpsiPreviewPixels({
    width: w,
    height: h,
    depth,
    hex: hexPayload,
  });

  if (!pixels) {
    throw new Error("eps_no_embedded_preview");
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.createImageData(w, h);
  imgData.data.set(pixels);
  ctx.putImageData(imgData, 0, 0);
  return canvasToImagePayload(canvas, "image/png");
}
