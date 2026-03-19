import Link from "next/link";
import { NewsItem } from "@/lib/types";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12 }}>
      <h3>{item.optimizedTitle}</h3>
      <p>{item.shortDescription}</p>
      <small>
        {item.source} · {new Date(item.publishedAt).toLocaleDateString()}
      </small>
      <br />
      <Link href={`/news/${item._id}`}>Read more</Link>
    </div>
  );
}
