const platformGuidance = {
  general: "",
  adobe:
    "Optimize for Adobe Stock: title must be a natural-language sentence (never keyword-stuffed), leading with subject then action then setting. Order keywords by relevance — Adobe weights the first several keywords heavily. Never duplicate a keyword.",
  shutterstock:
    'Optimize for Shutterstock: title must be a full descriptive sentence and must not repeat any word that also appears in the keyword list. Keywords must be lowercase, non-redundant, and avoid near-duplicate terms (e.g. don\u2019t include both "run" and "running").',
  istock:
    'Optimize for iStock/Getty: be literal and precise rather than interpretive — describe exactly what is visible. Prefer accuracy over keyword volume; include both a broad term and a specific term for the main subject (e.g. "fruit" and "sliced orange").',
  getty:
    "Optimize for iStock/Getty: be literal and precise rather than interpretive — describe exactly what is visible. Prefer accuracy over keyword volume; include both a broad term and a specific term for the main subject.",
  pond5:
    "Optimize for Pond5: include technical/format descriptors relevant to footage (e.g. shot type, motion, aerial) alongside subject keywords, since Pond5 rewards keyword breadth for video-style content.",
  vecteezy:
    "Optimize for Vecteezy: include style descriptors (e.g. flat, isometric, line art, minimalist) alongside subject keywords, since Vecteezy skews toward vector/illustration content.",
  freepik:
    "Optimize for Freepik: favor specific multi-word phrases over single broad generic terms, since Freepik\u2019s catalog is large and specificity helps the file surface.",
};

export function buildPrompt({
  titleLen,
  descLen,
  kwCount,
  customPrompt,
  platform,
}) {
  const guidance = platformGuidance[platform] || "";
  return `Analyze this image and generate stock-photo style metadata.${guidance ? `\n${guidance}` : ""}${customPrompt ? `\nAdditional instructions: ${customPrompt}` : ""}
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
