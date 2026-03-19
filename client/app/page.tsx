"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";
import { NewsItem } from "@/lib/types";
import NewsCard from "@/components/NewsCard";

const DEFAULT_SYMBOL = "AAPL";

export default function HomePage() {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [input, setInput] = useState("");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchNews(sym: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${API_BASE}/api/read/news?symbol=${sym}&limit=10`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await res.json();
      setItems(data.items || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews(symbol);
  }, [symbol]);

  function onSearch() {
    if (!input.trim()) return;
    setSymbol(input.trim().toUpperCase());
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Stock News</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search symbol (AAPL, AMZN...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={onSearch} style={{ marginLeft: 8 }}>
          Search
        </button>
      </div>

      <h2>{symbol} News</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading &&
        !error &&
        items.map((item) => <NewsCard key={item._id} item={item} />)}

      {!loading && !error && items.length === 0 && <p>No news found.</p>}
    </main>
  );
}
