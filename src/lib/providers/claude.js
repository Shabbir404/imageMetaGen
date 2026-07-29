import { buildPrompt, parseJsonResponse, ProviderError } from "./shared";

export async function call(imgBase64, apiKey, opts) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: buildPrompt(opts) },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: imgBase64,
              },
            },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new ProviderError(`claude_http_${res.status}`, res.status);
  const data = await res.json();
  const text = data.content?.find((c) => c.type === "text")?.text || "";
  return parseJsonResponse(text);
}
