import { CatalogParams, WheelAdProps } from "@/app/types/types";
export async function getWheelAdverts(params: CatalogParams) {
  //destructuring params
  const {
    page,
    limit = 12,
    category,
    maxPrice,
    state,
    diameter,
    make,
    material,
    tyreBrand,
    season,
    width,
    profile,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  try {
    const response = await fetch(`${apiBaseUrl}/api/ad/wheels?`, {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: ["wheel-ads"],
      },
    });
    if (!response.ok) throw new Error("Eroare de rețea: Încearcă din nou.");
    const payload = await response.json();
    let ads: WheelAdProps[] = payload.data || [];

    //GENERAL FILTERS
    //filter by category
    if (category)
      ads = ads.filter(
        (ad: WheelAdProps) => ad.category_id.toString() === category,
      );

    //filter by max price
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max))
        ads = ads.filter((ad: WheelAdProps) => (ad.price.value || 0) <= max);
    }

    //filter by state (new or used)
    if (state) {
      ads = ads.filter(
        (ad: WheelAdProps) => getAttribute(ad, "state") === state,
      );
    }
    if (diameter) {
      ads = ads.filter((ad: WheelAdProps) => {
        const rimInches = getAttribute(ad, "rims_inches");
        const tyreInches = getAttribute(ad, "tyres_inches");
        return rimInches === diameter || tyreInches === diameter;
      });
    }

    //CUSTOM FILTERS
    //category_id = 1647 => rims filters
    if (category === "1647") {
      if (make) {
        ads = ads.filter(
          (ad: WheelAdProps) =>
            getAttribute(ad, "donor_make") === formatBrand(make),
        );
      }
      if (material) {
        ads = ads.filter(
          (ad: WheelAdProps) => getAttribute(ad, "wheels_rims") == material,
        );
      }
    }

    //category_id = 1649 => tyres filters
    if (category === "1649") {
      if (tyreBrand) {
        ads = ads.filter(
          (ad: WheelAdProps) =>
            getAttribute(ad, "tire_brand") === formatBrand(tyreBrand),
        );
      }
      if (season) {
        ads = ads.filter(
          (ad: any) => getAttribute(ad, "tyres_type") === season,
        );
      }
      if (width) {
        ads = ads.filter(
          (ad: any) => getAttribute(ad, "tyres_width") === width,
        );
      }
      if (profile) {
        ads = ads.filter(
          (ad: any) => getAttribute(ad, "tyres_profile") === profile,
        );
      }
    }

    //ads sorting
    ads.sort((a: WheelAdProps, b: WheelAdProps): number => {
      let valA;
      let valB;
      if (sortBy === "price") {
        valA = a.price.value || 0;
        valB = b.price.value || 0;
      } else {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    //ads pagination
    const offset = (page - 1) * limit;
    const totalFilteredAds = ads.length;
    const paginatedAds = ads.slice(offset, offset + limit);
    return {
      items: paginatedAds,
      total: totalFilteredAds,
    };
  } catch (error) {
    console.log("Error " + error);
    return null;
  }
}

export async function getWheelAdvertById(id: string) {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  try {
    const response = await fetch(`${apiBaseUrl}/api/ad/wheels/${id}`, {
      method: "GET",
      next: {
        revalidate: 3600,
        tags: [`wheel-ad:${id}`],
      },
    });
    if (!response.ok) throw new Error("Eroare de rețea: Încearcă din nou.");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error " + error);
    return null;
  }
}

//attributes functions
export function getAttribute(
  advert: WheelAdProps,
  code: string,
): string | undefined {
  const value = advert.attributes
    .find((attribute) => attribute.code === code)
    ?.value.trim();
  return value || undefined;
}

export function getState(advert: WheelAdProps): string | undefined {
  const value = getAttribute(advert, "state");
  switch (value) {
    case "used":
      return "Second hand";
    case "new":
      return "Nou";
    default:
      return undefined;
  }
}

export function getWheelType(advert: WheelAdProps): string | undefined {
  const value = getAttribute(advert, "wheels_rims");
  switch (value) {
    case "parts-wheels-rims-type-steel":
      return "Oțel";
    case "parts-wheels-rims-type-alloy":
      return "Aliaj";
    default:
      return undefined;
  }
}

export function getRimSize(advert: WheelAdProps): string | undefined {
  const value = getAttribute(advert, "rims_inches");
  const match = value?.match(
    /parts-rims-inches-(13|14|15|16|17|18|19|20|21|22)$/,
  );

  return match?.[1];
}

export function getLocationName(cityId: Number): string | undefined {
  switch (cityId) {
    case 60321:
      return "Pitești, Argeș";
    //complete later with the rest of locations
    default:
      return undefined;
  }
}
export function formatSeason(value: string): string {
  switch (value.toLowerCase()) {
    case "parts-tyres-type-winter":
      return "Iarnă";
    case "parts-tyres-type-summer":
      return "Vară";
    case "parts-tyres-type-allseason":
      return "All Season";
    default:
      return value;
  }
}

export function formatBrand(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function formatTyreInches(value: string): string | undefined {
  switch (value) {
    case "parts-tyres-inches-12":
      return "12 inch si sub";
    case "parts-tyres-inches-13":
      return "13";
    case "parts-tyres-inches-14":
      return "14";
    case "parts-tyres-inches-15":
      return "15";
    case "parts-tyres-inches-16":
      return "16";
    case "parts-tyres-inches-16-5":
      return "16,5";
    case "parts-tyres-inches-17":
      return "17";
    case "parts-tyres-inches-17-5":
      return "17,5";
    case "parts-tyres-inches-18":
      return "18";
    case "parts-tyres-inches-19":
      return "19";
    case "parts-tyres-inches-19-5":
      return "19,5";
    case "parts-tyres-inches-20":
      return "20";
    case "parts-tyres-inches-21":
      return "21";
    case "parts-tyres-inches-22":
      return "22 inch si peste";
    default:
      return undefined;
  }
}

export function formatTyreWidth(value: string): string | undefined {
  switch (value) {
    case "parts-tyres-width-125":
      return "125";
    case "parts-tyres-width-135":
      return "135";
    case "parts-tyres-width-145":
      return "145";
    case "parts-tyres-width-155":
      return "155";
    case "parts-tyres-width-165":
      return "165";
    case "parts-tyres-width-175":
      return "175";
    case "parts-tyres-width-185":
      return "185";
    case "parts-tyres-width-195":
      return "195";
    case "parts-tyres-width-205":
      return "205";
    case "parts-tyres-width-215":
      return "215";
    case "parts-tyres-width-225":
      return "225";
    case "parts-tyres-width-235":
      return "235";
    case "parts-tyres-width-245":
      return "245";
    case "parts-tyres-width-255":
      return "255";
    case "parts-tyres-width-265":
      return "265";
    case "parts-tyres-width-275":
      return "275";
    case "parts-tyres-width-285":
      return "285";
    case "parts-tyres-width-295":
      return "295";
    case "parts-tyres-width-305":
      return "305";
    case "parts-tyres-width-315":
      return "315";
    case "parts-tyres-width-325":
      return "325";
    case "parts-tyres-width-335":
      return "335";
    case "parts-tyres-width-345":
      return "345";
    case "parts-tyres-width-355":
      return "355";
    case "parts-tyres-width-another":
      return "Altele";
    case "parts-tyres-width-30":
      return "30";
    case "parts-tyres-width-31":
      return "31";
    case "parts-tyres-width-32":
      return "32";
    case "parts-tyres-width-33":
      return "33";
    case "parts-tyres-width-35":
      return "35";
    case "parts-tyres-width-37":
      return "37";
    case "parts-tyres-width-5":
      return "5.00";
    case "parts-tyres-width-6":
      return "6.00";
    case "parts-tyres-width-7":
      return "7.00";
    case "parts-tyres-width-7-5":
      return "7.50";
    default:
      return undefined;
  }
}

export function formatTyresProfile(value: string): string | undefined {
  switch (value) {
    case "parts-tyres-profile-7":
      return "7";
    case "parts-tyres-profile-9-5":
      return "9.5";
    case "parts-tyres-profile-10-5":
      return "10.5";
    case "parts-tyres-profile-11-5":
      return "11.5";
    case "parts-tyres-profile-12-5":
      return "12.5";
    case "parts-tyres-profile-25":
      return "25";
    case "parts-tyres-profile-30":
      return "30";
    case "parts-tyres-profile-35":
      return "35";
    case "parts-tyres-profile-40":
      return "40";
    case "parts-tyres-profile-45":
      return "45";
    case "parts-tyres-profile-50":
      return "50";
    case "parts-tyres-profile-55":
      return "55";
    case "parts-tyres-profile-60":
      return "60";
    case "parts-tyres-profile-65":
      return "65";
    case "parts-tyres-profile-70":
      return "70";
    case "parts-tyres-profile-75":
      return "75";
    case "parts-tyres-profile-80":
      return "80";
    case "parts-tyres-profile-85":
      return "85";
    case "parts-tyres-profile-another":
      return "Altele";
    default:
      return undefined;
  }
}

export function formatCategoryId(value: Number): string {
  switch (value) {
    case 1647:
      return "Jante și roți";
    case 1649:
      return "Anvelope";
    default:
      return "Roți - Jante- Anvelope";
  }
}

export function formatDate(value: string): string | undefined {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return undefined;
  }

  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatPrice(advert: WheelAdProps): string | undefined {
  if (!Number.isFinite(advert.price?.value) || advert.price.value < 0) {
    return undefined;
  }

  return `${advert.price.value.toLocaleString("ro-RO", {
    maximumFractionDigits: 2,
  })}${advert.price.currency.trim() ? ` ${advert.price.currency.trim()}` : ""}`;
}
