import { buildPrompt, parseJsonResponse, ProviderError } from "./shared";

// Vision support on DeepSeek's own hosted API is unconfirmed as of writing.
// If this consistently fails for you, route DeepSeek keys through
// OpenRouter instead (openrouter.js already handles that).
export async function call(imgBase64, apiKey, opts) {
  let res;
  try {
    res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-v4-pro",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: buildPrompt(opts) },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imgBase64}` },
              },
            ],
          },
        ],
      }),
    });
  } catch (e) {
    throw new ProviderError("deepseek_cors_or_network", "cors_or_network");
  }
  if (!res.ok)
    throw new ProviderError(`deepseek_http_${res.status}`, res.status);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseJsonResponse(text);
}
