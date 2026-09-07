import { WheelsStock, WheelAdvertsLoading } from "@/app/components/components";
import { getWheelAdverts } from "@/services/advertService";
import { Suspense } from "react";
export default async function RimsDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters = await searchParams;
  const params = {
    page: filters.page ? Number(filters.page) : 1,
    limit: 9,
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
    query: filters.query,
    sortBy: filters.sortBy,
    order: filters.order,
  };
  const data = await getWheelAdverts(params);
  return (
    <Suspense fallback={<WheelAdvertsLoading />}>
      <WheelsStock
        wheelAdverts={data?.items}
        total={data?.total}
        limit={9}
        dashboardPage={true}
      />
    </Suspense>
  );
}
