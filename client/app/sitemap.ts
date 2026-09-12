import type { MetadataRoute } from "next";
import { getWheelAdverts } from "@/services/advertService";
import { isPublicAdvert, marketplacePath, siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}${marketplacePath}`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
  const configuredLimit = Number.parseInt(
    process.env.SITEMAP_MAX_ADS || "500",
    10,
  );
  const maxAds = Number.isFinite(configuredLimit)
    ? Math.min(Math.max(configuredLimit, 0), 5000)
    : 500;
  const data = await getWheelAdverts({ page: 1, limit: maxAds });

  const seenIds = new Set<number>();
  const advertEntries = (data?.items ?? [])
    .filter((advert) => {
      if (!isPublicAdvert(advert) || seenIds.has(advert.id)) return false;
      seenIds.add(advert.id);
      return true;
    })
    .map((advert) => {
      const date = advert.activated_at || advert.created_at;
      const parsedDate = date ? new Date(date) : undefined;
      return {
        url: `${siteUrl}${marketplacePath}/${advert.id}`,
        ...(parsedDate && !Number.isNaN(parsedDate.getTime())
          ? { lastModified: parsedDate }
          : {}),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  return [...staticEntries, ...advertEntries];
}
