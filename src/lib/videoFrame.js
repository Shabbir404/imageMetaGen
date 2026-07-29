// Grabs a single frame from a video file client-side (canvas capture),
// so the tool never needs to upload or process the full video —
// just one image, same pipeline as a photo.

import { normalizeImagePayload } from "./imagePayload";

export function extractVideoFrame(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(0.3, (video.duration || 1) / 4);
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const payload = normalizeImagePayload(canvas.toDataURL("image/png"));
      URL.revokeObjectURL(url);
      resolve(payload);
    });

    video.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("video_decode_failed"));
    });

    video.load();
  });
}

export function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const payload = normalizeImagePayload(reader.result, "image/png");
      resolve(payload);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
