import { buildPrompt, parseJsonResponse, ProviderError } from "./shared";

export async function call(imgBase64, apiKey, opts) {
  const mimeType = opts?.mimeType || "image/png";
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(opts) },
              { inline_data: { mime_type: mimeType, data: imgBase64 } },
            ],
          },
        ],
      }),
    },
  );
  if (!res.ok) throw new ProviderError(`gemini_http_${res.status}`, res.status);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return parseJsonResponse(text);
}
