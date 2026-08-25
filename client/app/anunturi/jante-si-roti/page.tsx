import { WheelsStock } from "@/app/components/WheelsStock";
import { WheelAdvertFilters } from "@/app/components/WheelAdvertFilters";
import { getWheelAdverts } from "@/services/advertService";
import { Suspense } from "react";

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
  return (
    <Suspense fallback={"Se incarca"}>
      <WheelsStock
        wheelAdverts={data?.items}
        total={data?.total}
        limit={params.limit}
      />
    </Suspense>
  );
}
