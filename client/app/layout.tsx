import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import { Inter } from "next/font/google";
import "./styles/styles.css";
import "./styles/buttons.css";
import "./styles/status.css";
import { Header, Footer } from "@/app/components/components";
import { Toaster } from "sonner";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://wistopwheels.ro";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title:
    "WIS Top Wheels — Jante Premium, Mașini Second-Hand Import Germania, Vulcanizare",
  description:
    "Cumpără jante aliaj de calitate, anvelope, și mașini de vânzare importate din Germania, cu garanție și transparență totală. Servicii de vulcanizare și direcție roți 3D. Răspund rapid pe WhatsApp și telefon.",
  applicationName: "WIS Top Wheels",
  authors: [{ name: "WIS Top Wheels", url: baseUrl }],
  keywords: [
    "jante",
    "anvelope",
    "cauciucuri",
    "anvelope iarna",
    "anvelope vara",
    "cauicucuri iarna",
    "cauciucuri vara",
    "anvelope 205/55/R16",
    "cauciucuri 205/55/R16",
    "anvelope 225/45/R17",
    "cauciucuri 225/45/R17",
    "cauciucuri 225/55R17",
    "anvelope 225/40/R18",
    "cauciucuri 225/40/R18",
    "jante aftermarket",
    "jante aliaj",
    "jante auto",
    "mașini de vânzare",
    "auto second-hand",
    "auto germania",
    "service roți",
    "service",
    "vulcanizare",
    "direcție roți 3D",
    "jante bmw",
    "jante audi",
    "jante mercedes",
    "jante volkswagen",
    "jante vag",
    "jante audi",
    "jante skoda",
    "jante seat",
    "jante 5x112",
    "jante R15",
    "jante R16",
    "jante R17",
    "jante R18",
    "jante R19",
    "jante R20",
    "jante 15",
    "jante 16",
    "jante 17",
    "jante 18",
    "jante 20",
    "bmw",
    "mercedes",
    "audi",
    "volkswagen",
    "skoda",
    "seat",
    "Argeș",
    "Suseni",
  ],
  creator: "WIS Top Wheels",
  publisher: "WIS Top Wheels",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WIS Top Wheels",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: baseUrl,
    title: "WIS Top Wheels — Jante Premium, Mașini Import Germania",
    description:
      "Cumpără jante aliaj de calitate, anvelope, și mașini de vânzare importate din Germania cu garanție și transparență totală.",
    siteName: "WIS Top Wheels",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "WIS Top Wheels — Jante Premium și Mașini de Vânzare",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WIS Top Wheels — Jante Premium, Mașini Import Germania",
    description:
      "Cumpără jante aliaj de calitate, anvelope, și mașini de vânzare importate din Germania cu garanție și transparență totală.",
    images: [`${baseUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "WIS Top Wheels",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          "Cumpără jante aliaj de calitate, anvelope, și mașini de vânzare importate din Germania cu garanție și transparență totală.",
        sameAs: [
          "https://www.instagram.com/wis_wheels_cars/",
          "https://www.tiktok.com/@wis_wheels_cars",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Comuna Suseni, Sat Cersani nr 355",
          postalCode: "117695",
          addressLocality: "Suseni",
          addressRegion: "Argeș",
          addressCountry: "RO",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          telephone: "+40-726-547-517",
          availableLanguage: ["ro", "en"],
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Saturday",
            opens: "09:00",
            closes: "14:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: "Sunday",
            opens: "00:00",
            closes: "00:00",
          },
        ],
        geo: {
          "@type": "GeoCoordinates",
          latitude: "44.72140136475622",
          longitude: "24.937738089936552",
        },
      },
      {
        "@type": "LocalBusiness",
        name: "WIS Top Wheels",
        image: `${baseUrl}/logo.png`,
        url: baseUrl,
        telephone: "+40726547517",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Comuna Suseni, Sat Cersani nr 355",
          postalCode: "117695",
          addressLocality: "Suseni",
          addressRegion: "Argeș",
          addressCountry: "RO",
        },
        areaServed: ["RO"],
        priceRange: "RON",
      },
      {
        "@type": "WebSite",
        url: baseUrl,
        name: "WIS Top Wheels",
        description:
          "Cumpără jante aliaj de calitate, anvelope, și mașini de vânzare importate din Germania cu garanție și transparență totală.",
      },
    ],
  };

  return (
    <html
      lang="ro"
      className={`${barlowCondensed.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <>
          <Header />
          {children}
          <Footer />
          <Toaster theme="dark" />
        </>
      </body>
    </html>
  );
}
