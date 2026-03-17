const axios = require("axios");

const BASE_URL = "https://seekingalpha.com";

async function fetchTopNews(symbol) {
  const url = `${BASE_URL}/api/v3/symbols/${symbol}/news`;

  const response = await axios.get(url, {
    params: {
      "page[size]": 20,
      "page[number]": 1,
    },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
      Referer: `${BASE_URL}/symbol/${symbol}/news`,
    },
  });

  const items = response.data?.data || [];

  return items.map((item) => ({
    title: item.attributes?.title,
    url: `${BASE_URL}${item.links?.self}`,
    source: "Seeking Alpha",
    isPremium: item.attributes?.is_locked ?? false,
    publishedAt: item.attributes?.publishOn
      ? new Date(item.attributes.publishOn)
      : null,
  }));
}

module.exports = { fetchTopNews };
