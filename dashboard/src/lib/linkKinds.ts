import { detectPlatform, isSocialPlatform } from "@/lib/platform";
import type { LinkKind } from "@/api/client";

export type DraftLinkInput = {
  title: string;
  url: string;
  platform?: string;
  emoji?: string;
};

/** Map onboarding / import order to stored link kinds (first non-social = featured). */
export function assignLinkKinds(
  items: DraftLinkInput[],
): Array<DraftLinkInput & { kind: LinkKind; platform: string }> {
  let featuredUsed = false;
  return items.map((item) => {
    const platform = item.platform ?? detectPlatform(item.url);
    let kind: LinkKind = "link";
    if (isSocialPlatform(platform)) {
      kind = "social";
    } else if (!featuredUsed) {
      kind = "featured";
      featuredUsed = true;
    }
    return { ...item, platform, kind };
  });
}
