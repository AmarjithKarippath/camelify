import posts from "./blog-data.json";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  keywords: string[];
  excerpt: string;
  content: string;
  meta_description: string;
};

export function getAllPosts(): BlogPost[] {
  return posts as BlogPost[];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
