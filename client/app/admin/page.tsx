"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";

export default function AdminIngestPage() {
  const [symbol, setSymbol] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchNews() {
    if (!symbol.trim()) return;

    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch(
        `${API_BASE}/api/news/search?symbol=${symbol.trim().toUpperCase()}`,
      );

      if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
      }

      const data = await res.json();
      setStatus(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setStatus(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }
  async function enrichNews() {
    if (!symbol.trim()) return;

    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch(`${API_BASE}/api/enrich/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbol.trim().toUpperCase() }),
      });

      if (!res.ok) {
        throw new Error(`Enrich failed: ${res.status}`);
      }

      const data = await res.json();
      setStatus(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setStatus(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Admin — Ingest Symbol</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Symbol (e.g. AMZN)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: 16,
            border: "1px solid #ccc",
            borderRadius: 6,
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={loading}
          onClick={fetchNews}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "none",
            background: "#0a58ca",
            color: "#fff",
          }}
        >
          Fetch News
        </button>

        <button
          disabled={loading}
          onClick={enrichNews}
          style={{
            padding: "10px 16px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          Enrich News
        </button>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Working…</p>}

      {status && (
        <pre
          style={{
            marginTop: 16,
            background: "#f5f5f5",
            padding: 12,
            borderRadius: 6,
            overflowX: "auto",
          }}
        >
          {status}
        </pre>
      )}
    </main>
  );
}
