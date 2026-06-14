export type Category = { id: string; label: string; emoji: string };

export const CATEGORIES: Category[] = [
  { id: "fitness", label: "Fitness & Wellness", emoji: "💪" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
  { id: "food", label: "Food & Cooking", emoji: "🍳" },
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "tech", label: "Tech", emoji: "💻" },
  { id: "business", label: "Business", emoji: "💼" },
  { id: "finance", label: "Finance", emoji: "💰" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "photography", label: "Photography", emoji: "📷" },
  { id: "lifestyle", label: "Lifestyle", emoji: "✨" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "parenting", label: "Parenting", emoji: "👶" },
  { id: "other", label: "Other", emoji: "🌟" },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function getCategory(id: string | null | undefined): Category | null {
  if (!id) return null;
  return byId.get(id) ?? null;
}
