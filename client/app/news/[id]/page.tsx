"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE } from "@/lib/api";

interface NewsDetail {
  optimizedTitle: string;
  optimizedContent: string;
  source: string;
  publishedAt: string;
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${API_BASE}/api/read/news/${id}`);

        if (!res.ok) {
          throw new Error("Article not found");
        }

        const data = await res.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (error) return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  if (!article) return null;

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>{article.optimizedTitle}</h1>

      <p style={{ color: "#666", marginBottom: 20 }}>
        {article.source} · {new Date(article.publishedAt).toLocaleDateString()}
      </p>

      <article
        style={{
          lineHeight: 1.8,
          fontSize: 16,
          whiteSpace: "pre-line",
        }}
      >
        {article.optimizedContent}
      </article>
    </main>
  );
}
