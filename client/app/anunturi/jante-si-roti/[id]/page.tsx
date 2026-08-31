import { getWheelAdvertById } from "@/services/advertService";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WheelAdvert } from "@/app/components/WheelAdvert";

export default async function WheelAdvertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getWheelAdvertById(id);

  if (!response) notFound();

  return (
    <main className="section">
      <WheelAdvert advert={response.data} />
    </main>
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
