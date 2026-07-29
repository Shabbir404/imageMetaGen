export function buildPrompt({ titleLen, descLen, kwCount, customPrompt }) {
  return `Analyze this image and generate stock-photo style metadata.${customPrompt ? `\nAdditional instructions: ${customPrompt}` : ""}
Return ONLY raw JSON, no markdown fences, no preamble, in exactly this shape:
{"title":"<natural language sentence, max ${titleLen} characters>","description":"<description, max ${descLen} characters>","keywords":["<keyword>", ... up to ${kwCount} lowercase single/two-word keywords, most relevant first, no duplicates]}`;
}

export function parseJsonResponse(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

export class ProviderError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
