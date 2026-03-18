const { fetchArticleContent } = require("./articleFetcher.service");
const { buildPremiumContext } = require("./premiumContext.service");

async function resolveArticleInput(rawNews) {
  if (rawNews.isPremium) {
    return {
      type: "contextual",
      content: buildPremiumContext(rawNews),
    };
  }

  const content = await fetchArticleContent(rawNews.url);

  // 🔥 fallback if blocked
  if (!content) {
    return {
      type: "contextual",
      content: buildPremiumContext(rawNews),
    };
  }

  return {
    type: "full",
    content,
  };
}

module.exports = { resolveArticleInput };
