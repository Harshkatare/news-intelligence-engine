function buildPremiumContext(rawNews) {
  return `
Title: ${rawNews.title}
Stock: ${rawNews.stockSymbol}
Source: Seeking Alpha
Published At: ${rawNews.publishedAt?.toISOString()}

This article is premium and full content is not available.
Generate an enriched, original article using:
- The title above
- General market context
- Recent trends related to the stock
- Investor-focused analysis
`;
}

module.exports = { buildPremiumContext };
