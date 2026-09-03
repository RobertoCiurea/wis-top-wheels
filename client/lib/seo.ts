import type { WheelAdProps } from "@/app/types/types";

export const siteUrl = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://wis-top-wheels.ro"
).replace(/\/$/, "");

export const siteName = "WIS Top Wheels";
export const marketplacePath = "/anunturi/jante-si-roti";

const publicQueryKeys = [
  "page",
  "category",
  "maxPrice",
  "state",
  "diameter",
  "make",
  "material",
  "tyreBrand",
  "season",
  "width",
  "profile",
  "sortBy",
  "order",
] as const;

export function canonicalMarketplaceUrl(
  searchParams: Record<string, string | string[] | undefined> = {},
) {
  const query = new URLSearchParams();

  for (const key of publicQueryKeys) {
    const value = searchParams[key];
    const normalized = Array.isArray(value) ? value[0] : value;
    if (normalized?.trim()) query.set(key, normalized.trim());
  }

  const queryString = query.toString();
  return `${siteUrl}${marketplacePath}${queryString ? `?${queryString}` : ""}`;
}

export function cleanText(value: string | undefined, maxLength = 155) {
  const text = value?.replace(/\s+/g, " ").trim() || "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function getPublicImage(advert: WheelAdProps) {
  return advert.images.find((image) => image.url.trim())?.url.trim();
}

export function getAdvertDescription(advert: WheelAdProps) {
  const details = [
    advert.title,
    advert.category_id === 1649 ? "anvelope auto" : "jante și roți",
    advert.price?.value >= 0 && advert.price.currency
      ? `${advert.price.value} ${advert.price.currency}`
      : undefined,
    advert.description,
  ].filter(Boolean);

  return (
    cleanText(details.join(". ")) ||
    "Anunț de jante și roți disponibil la WIS Top Wheels."
  );
}

export function isPublicAdvert(advert: WheelAdProps | undefined) {
  return Boolean(
    advert &&
    advert.status !== "removed_by_user" &&
    advert.status !== "deleted",
  );
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
