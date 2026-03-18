async function enrichArticle({ title, inputText }) {
  return {
    text: `
${title}

This is placeholder enriched content.

The AI enrichment pipeline is correctly wired,
but live generation is currently disabled due to quota limits.

Original content:
${inputText.slice(0, 800)}...
`,
    model: "disabled",
  };
}

module.exports = { enrichArticle };
