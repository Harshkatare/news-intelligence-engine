const { GoogleGenAI } = require("@google/genai");

const AI_MODEL = process.env.AI_MODEL || "gemini-2.0-flash";
const AI_DELAY_MS = Number(process.env.AI_DELAY_MS || 7000);

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enrichArticle({ title, inputText }) {
  const prompt = `
You are a senior financial news editor writing for an investor-focused platform.

Rewrite and enrich the article below into an original, professional, 
Seeking Alpha–style analyst roundup.

STRICT OUTPUT FORMAT (do not deviate):

TITLE:
<one improved headline>

SUMMARY:
<3–4 concise lines summarizing the key takeaways>

CONTENT:
<full article, minimum 150 words>

CONTENT REQUIREMENTS:
- Explicitly retain analyst firm names (e.g., JPMorgan, Wedbush, Morgan Stanley)
- Explicitly retain important numbers (price targets, percentages, growth figures)
- Preserve the multi-analyst perspective if present
- Preserve stock movement information if mentioned
- Preserve sector or industry context (e.g., memory market, AI, supply chain)
- Do NOT invent data or analyst opinions
- If a number or firm is not in the original article, do not add it
- Do NOT repeat the title inside the content
- Professional, neutral tone (not promotional, not speculative)
- No financial advice

ORIGINAL TITLE:
${title}

ORIGINAL ARTICLE:
${inputText}
`;

  try {
    const response = await client.models.generateContent({
      model: AI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text = response.text;

    if (!text || text.length < 100) {
      throw new Error("Empty or invalid Gemini response");
    }

    // HARD throttle
    await sleep(AI_DELAY_MS);

    return {
      text,
      model: AI_MODEL,
    };
  } catch (err) {
    if (
      err.status === 429 ||
      err.message?.includes("quota") ||
      err.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      console.error("🛑 Gemini quota exhausted. Stopping enrichment.");
      throw err;
    }

    console.error("🔴 Gemini error:", err.message);

    return {
      text: null,
      model: "failed",
    };
  }
}

module.exports = { enrichArticle };

