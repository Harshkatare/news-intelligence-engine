const RawNews = require("../models/RawNews");
const News = require("../models/News");
const { resolveArticleInput } = require("./contentResolver.service");
const { enrichArticle } = require("./gemini.service");
const { MAX_ARTICLES_TO_PROCESS } = require("../config/app.config");

const AI_ENABLED = process.env.AI_ENABLED === "true";

function parseAIOutput(text) {
  const titleMatch = text.match(/TITLE:\s*([\s\S]*?)\nSUMMARY:/);
  const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)\nCONTENT:/);
  const contentMatch = text.match(/CONTENT:\s*([\s\S]*)$/);

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    summary: summaryMatch ? summaryMatch[1].trim() : null,
    content: contentMatch ? contentMatch[1].trim() : text.trim(),
  };
}

async function runEnrichmentForSymbol(symbol) {
  const rawArticles = await RawNews.find({ stockSymbol: symbol })
    .sort({ publishedAt: -1 })
    .limit(20);

  const toProcess = rawArticles.slice(0, MAX_ARTICLES_TO_PROCESS);

  for (const raw of toProcess) {
    const exists = await News.findOne({ originalUrl: raw.url });
    if (exists) continue;

    try {
      console.log(`🚀 Processing: ${raw.title.slice(0, 60)}`);

      const resolved = await resolveArticleInput(raw);

      let enrichedText;
      let usedModel;

      if (AI_ENABLED) {
        const result = await enrichArticle({
          title: raw.title,
          inputText: resolved.content,
        });

        enrichedText = result.text;
        usedModel = result.model;
      } else {
        enrichedText = resolved.content;
        usedModel = "disabled";
      }

      if (!enrichedText) continue;

      const parsed = parseAIOutput(enrichedText);

      await News.create({
        stockSymbol: raw.stockSymbol,
        originalTitle: raw.title,
        optimizedTitle: parsed.title || raw.title,
        originalUrl: raw.url,
        shortDescription: parsed.summary?.slice(0, 300),
        optimizedContent: parsed.content,
        source: raw.source,
        publishedAt: raw.publishedAt,
        aiModel: usedModel,
      });
    } catch (error) {
      console.error(`🔴 Error processing article: ${error.message}`);
    }
  }
}

module.exports = { runEnrichmentForSymbol };
