import { buildPrompt, parseJsonResponse, ProviderError } from "./shared";

export async function call(imgBase64, apiKey, opts) {
  const model = opts.model || "google/gemini-2.5-flash";
  const mimeType = opts?.mimeType || "image/png";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt(opts) },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imgBase64}` },
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok)
    throw new ProviderError(`openrouter_http_${res.status}`, res.status);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseJsonResponse(text);
}
