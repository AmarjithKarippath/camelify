import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.camelify.com";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips on link-in-bio tools, Linktree alternatives, and digital business cards for creators and businesses.",
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Camelify Blog",
    description:
      "Tips on link-in-bio tools, Linktree alternatives, and digital business cards.",
    url: `${siteUrl}/blogs`,
  },
};

export default function BlogsPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-container px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink-heading">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-body">
          Guides on link-in-bio tools, Linktree alternatives, and digital business cards.
        </p>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blogs/${post.slug}`}
                className="block rounded-card bg-surface p-6 shadow-sm ring-1 ring-black/5 transition hover:ring-primary/30"
              >
                <h2 className="text-xl font-bold text-ink-heading">{post.title}</h2>
                <p className="mt-2 text-sm text-ink-body">{post.excerpt}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary">
                  Read more →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
