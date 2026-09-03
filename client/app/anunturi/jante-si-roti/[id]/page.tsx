import { getWheelAdvertById } from "@/services/advertService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WheelAdvert } from "@/app/components/WheelAdvert";
import { SessionProvider } from "next-auth/react";
import {
  getAdvertDescription,
  getPublicImage,
  isPublicAdvert,
  safeJsonLd,
  siteName,
  siteUrl,
} from "@/lib/seo";
export default async function WheelAdvertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getWheelAdvertById(id);

  if (!response?.data) notFound();

  return (
    <SessionProvider>
      <main className="section">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Acasă",
                  item: siteUrl,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Anunțuri jante și roți",
                  item: `${siteUrl}/anunturi/jante-si-roti`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: response.data.title,
                  item: `${siteUrl}/anunturi/jante-si-roti/${response.data.id}`,
                },
              ],
            }),
          }}
        />
        {isPublicAdvert(response.data) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: safeJsonLd({
                "@context": "https://schema.org",
                "@type": "Product",
                name: response.data.title,
                description: getAdvertDescription(response.data),
                ...(getPublicImage(response.data)
                  ? { image: [getPublicImage(response.data)] }
                  : {}),
                offers:
                  response.data.price?.value >= 0 &&
                  response.data.price.currency
                    ? {
                        "@type": "Offer",
                        url: `${siteUrl}/anunturi/jante-si-roti/${response.data.id}`,
                        price: response.data.price.value,
                        priceCurrency: response.data.price.currency,
                        availability: "https://schema.org/InStock",
                      }
                    : undefined,
              }),
            }}
          />
        )}
        <WheelAdvert advert={response.data} />
      </main>
    </SessionProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const response = await getWheelAdvertById(id);
  const advert = response?.data;
  const title = advert?.title?.trim() || "Anunț jante și roți";
  const canonical = `${siteUrl}/anunturi/jante-si-roti/${id}`;
  const publicAdvert = isPublicAdvert(advert);

  return {
    title: `${title} | WIS Top Wheels`,
    description: advert
      ? getAdvertDescription(advert)
      : "Detalii anunț jante și roți.",
    alternates: { canonical },
    robots: publicAdvert
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      url: canonical,
      siteName,
      title: `${title} | ${siteName}`,
      description: advert
        ? getAdvertDescription(advert)
        : "Detalii anunț jante și roți.",
      ...(advert && getPublicImage(advert)
        ? { images: [{ url: getPublicImage(advert)!, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description: advert
        ? getAdvertDescription(advert)
        : "Detalii anunț jante și roți.",
      ...(advert && getPublicImage(advert)
        ? { images: [getPublicImage(advert)!] }
        : {}),
    },
  };
}
