import { getWheelAdvertById } from "@/services/advertService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WheelAdvert } from "@/app/components/WheelAdvert";
import { SessionProvider } from "next-auth/react";
export default async function WheelAdvertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getWheelAdvertById(id);

  if (!response) notFound();

  return (
    <SessionProvider>
      <main className="section">
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
  const title = response?.title?.trim() || "Anunț jante și roți";

  return {
    title: `${title} | WIS Top Wheels`,
    description:
      response?.description?.trim().slice(0, 155) ||
      "Detalii anunț jante și roți.",
  };
}
