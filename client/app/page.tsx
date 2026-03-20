"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { NewsItem } from "@/lib/types";
import NewsCard from "@/components/NewsCard";

const DEFAULT_SYMBOL = "AAPL";
const PAGE_SIZE = 10;

export default function HomePage() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [input, setInput] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNews(sym: string, pageNum: number, append = false) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/read/news?symbol=${sym}&page=${pageNum}&limit=${PAGE_SIZE}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await res.json();
      const newItems: NewsItem[] = data.items || [];

      setItems((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(newItems.length === PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      if (!append) setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Load first page when symbol changes
  useEffect(() => {
    setPage(1);
    fetchNews(symbol, 1, false);
  }, [symbol]);

  function onSearch() {
    if (!input.trim()) return;
    setSymbol(input.trim().toUpperCase());
  }

  function loadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(symbol, nextPage, true);
  }

  return (
    <main style={{ maxWidth: 900, margin: "0px auto" }}>
      <h1>Stock News</h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <input
          placeholder="Search symbol (AAPL, AMZN...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
        <button
          onClick={onSearch}
          style={{
            padding: "10px 16px",
            fontSize: 16,
            borderRadius: 6,
            border: "none",
            background: "#0a58ca",
            color: "#fff",
          }}
        >
          Search
        </button>
      </div>

      <h2>{symbol} News</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.map((item) => (
        <NewsCard key={item._id} item={item} />
      ))}

      {loading && <p>Loading...</p>}

      {!loading && hasMore && items.length > 0 && (
        <button
          onClick={loadMore}
          style={{
            marginTop: 24,
            padding: "10px 16px",
            fontSize: 15,
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          Load more
        </button>
      )}

      {!loading && items.length === 0 && <p>No news found.</p>}
    </main>
  );
}
