import Link from "next/link";
import { NewsItem } from "@/lib/types";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h3 style={{ fontSize: 18 }}>{item.optimizedTitle}</h3>

      <p style={{ color: "#444" }}>{item.shortDescription}</p>

      <div style={{ fontSize: 13, color: "#666" }}>
        {item.source} ·{" "}
        {new Date(item.publishedAt).toLocaleDateString()}
      </div>

      <div style={{ marginTop: 8 }}>
        <Link href={`/news/${item._id}`}>Read more →</Link>
      </div>
    </div>
  );
}
