import { WheelsStock } from "@/app/components/WheelsStock";
import { getWheelAdverts } from "@/services/advertService";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import {
  canonicalMarketplaceUrl,
  safeJsonLd,
  siteName,
  siteUrl,
} from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonical = canonicalMarketplaceUrl(params);
  const allowedKeys = new Set([
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
  ]);
  const hasUnsupportedQuery = Object.keys(params).some(
    (key) => !allowedKeys.has(key),
  );
  const page = Number(
    Array.isArray(params.page) ? params.page[0] : params.page || "1",
  );
  const isValidPage = Number.isInteger(page) && page > 0;
  return {
    title: "Jante și roți auto | Anunțuri jante și anvelope",
    description:
      "Descoperă anunțuri cu jante, roți complete și anvelope auto, noi sau second hand, disponibile prin WIS Top Wheels.",
    alternates: { canonical },
    robots: {
      index: !hasUnsupportedQuery && isValidPage,
      follow: true,
      googleBot: {
        index: !hasUnsupportedQuery && isValidPage,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      url: canonical,
      siteName,
      title: "Jante și roți auto | Anunțuri jante și anvelope",
      description:
        "Anunțuri actualizate cu jante, roți și anvelope auto disponibile prin WIS Top Wheels.",
    },
    twitter: {
      card: "summary_large_image",
      title: "Jante și roți auto | WIS Top Wheels",
      description: "Anunțuri cu jante, roți complete și anvelope auto.",
    },
  };
}

export default async function WheelAdverts({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters = await searchParams;
  const params = {
    page: filters.page ? Number(filters.page) : 1,
    limit: 12,
    category: filters.category,
    maxPrice: filters.maxPrice,
    state: filters.state,
    diameter: filters.diameter,
    make: filters.make,
    material: filters.material,
    tyreBrand: filters.tyreBrand,
    season: filters.season,
    width: filters.width,
    profile: filters.profile,
    sortBy: filters.sortBy,
    order: filters.order,
  };
  const data = await getWheelAdverts(params);
  const adverts = data?.items ?? [];
  const listingUrl = `${siteUrl}/anunturi/jante-si-roti`;

  return (
    <SessionProvider>
      <Suspense fallback={"Se incarca"}>
        <h1 className="display d2">
          Jante și roți auto: anunțuri de jante și anvelope
        </h1>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Anunțuri jante și roți auto",
              itemListElement: adverts.map((advert, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${listingUrl}/${advert.id}`,
                name: advert.title,
              })),
            }),
          }}
        />
        <WheelsStock
          wheelAdverts={adverts}
          total={data?.total}
          limit={params.limit}
        />
      </Suspense>
    </SessionProvider>
  );
}
