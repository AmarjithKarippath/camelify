import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.camelify.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.meta_description,
    keywords: post.keywords,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.meta_description,
      url: `${siteUrl}/blogs/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description,
    url: `${siteUrl}/blogs/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Camelify",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Header />
      <main id="main" className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blogs" className="text-sm font-semibold text-primary hover:underline">
          ← Back to blog
        </Link>
        <article className="mt-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-heading">
            {post.title}
          </h1>
          <div className="mt-8 space-y-4 leading-relaxed text-ink-body">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>

        <div className="mt-12 rounded-card bg-surface p-8 text-center shadow-sm ring-1 ring-black/5">
          <h2 className="text-xl font-bold text-ink-heading">
            Ready to build your link in bio?
          </h2>
          <p className="mt-2 text-sm text-ink-body">
            Custom domain on every plan. Free analytics. No surprise suspensions.
          </p>
          <Link
            href="/signup"
            className="mt-5 inline-block rounded-input bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
          >
            Get started free
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
