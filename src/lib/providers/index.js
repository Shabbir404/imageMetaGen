import * as gemini from "./gemini";
import * as claude from "./claude";
import * as openrouter from "./openrouter";
import * as openai from "./openai";
import * as deepseek from "./deepseek";

export const PROVIDERS = {
  gemini: { label: "Gemini", call: gemini.call, note: null },
  claude: { label: "Claude", call: claude.call, note: null },
  openrouter: { label: "OpenRouter", call: openrouter.call, note: null },
  openai: {
    label: "OpenAI",
    call: openai.call,
    note: "May hit browser CORS errors — if so, route via OpenRouter instead.",
  },
  deepseek: {
    label: "DeepSeek",
    call: deepseek.call,
    note: "Vision support unconfirmed on DeepSeek\u2019s own API — OpenRouter is the safer route.",
  },
};
