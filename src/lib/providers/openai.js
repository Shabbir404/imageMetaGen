import { buildPrompt, parseJsonResponse, ProviderError } from "./shared";

export async function call(imgBase64, apiKey, opts) {
  const mimeType = opts?.mimeType || "image/png";
  let res;
  try {
    res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
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
  } catch (e) {
    throw new ProviderError("openai_cors_or_network", "cors_or_network");
  }
  if (!res.ok) throw new ProviderError(`openai_http_${res.status}`, res.status);
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  return parseJsonResponse(text);
}
