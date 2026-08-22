export async function getWheelAdverts(page: number, limit: number = 10) {
  const offset = (page - 1) * limit;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/ad/wheels?offest=${offset}&limit=${limit}`,
      {
        method: "GET",
        next: {
          revalidate: 3600,
          tags: ["wheel-ads"],
        },
      },
    );
    if (!response.ok) throw new Error("Eroare de rețea: Încearcă din nou.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error " + error);
    return null;
  }
}
