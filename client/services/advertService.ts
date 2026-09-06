import { CatalogParams, WheelAdProps } from "@/app/types/types";
import Fuse, { Expression } from "fuse.js";

//query search configuration
type SearchSeason = "winter" | "summer" | "allseason";
type SearchState = "new" | "used";
type SearchCategory = "rims" | "tyres";

type ParsedDimension = {
  width?: string;
  profile?: string;
  diameter?: string;
};

type ParsedSearchQuery = {
  textTerms: string[];
  season?: SearchSeason;
  state?: SearchState;
  category?: SearchCategory;
  dimension?: ParsedDimension;
};

//extend wheel advert type with search text property (human readbale properties that help in query)

type SearchableWheelAd = WheelAdProps & {
  searchText: string;
};

//search synonyms
const SEARCH_SYNONYMS: Record<string, string[]> = {
  // TYRES
  cauciuc: ["anvelopa", "anvelope"],
  cauciucuri: ["anvelopa", "anvelope"],
  cauciucurile: ["anvelopa", "anvelope"],
  pneu: ["anvelopa", "anvelope"],
  pneuri: ["anvelopa", "anvelope"],
  anvelopa: ["anvelopa", "anvelope", "cauciuc", "cauciucuri"],
  anvelope: ["anvelopa", "anvelope", "cauciuc", "cauciucuri"],

  // RIMS
  janta: ["janta", "jante", "roti"],
  jante: ["janta", "jante", "roti"],
  jenti: ["janta", "jante", "roti"],

  // WHEELS
  roata: ["roata", "roti"],
  roti: ["roata", "roti"],

  // SEASONS
  iarna: ["iarna", "winter"],
  winter: ["iarna", "winter"],

  vara: ["vara", "summer"],
  summer: ["vara", "summer"],

  allseason: ["allseason", "all season", "all-season"],
  "all-season": ["allseason", "all season", "all-season"],
  "all season": ["allseason", "all season", "all-season"],

  // STATE
  nou: ["nou", "new"],
  noi: ["nou", "new"],
  noua: ["nou", "new"],
  new: ["nou", "new"],

  second: ["second hand", "used"],
  hand: ["second hand", "used"],
  "second hand": ["second hand", "used"],
  folosit: ["second hand", "used"],
  folosite: ["second hand", "used"],
  used: ["second hand", "used"],
};

//stop words (words that slow and break the search)
const STOP_WORDS = new Set([
  "pe",
  "de",
  "la",
  "in",
  "din",
  "cu",
  "si",
  "pentru",
  "un",
  "o",
  "ale",
  "ai",
  "a",
  "care",
  "este",
  "sunt",
  "mai",
  "foarte",
]);

//search normalization function (diacritics fix)
export function normalizeSearchText(value: string): string {
  return value
    ? value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
    : "";
}

//attribute search helpers functions
function getSearchableAttributeValue(ad: WheelAdProps, code: string): string {
  const value = getAttribute(ad, code);

  if (!value) {
    return "";
  }

  switch (code) {
    case "tyres_type": {
      switch (value) {
        case "parts-tyres-type-winter":
          return "iarna winter";

        case "parts-tyres-type-summer":
          return "vara summer";

        case "parts-tyres-type-allseason":
          return "all season allseason all-season";

        default:
          return normalizeSearchText(value);
      }
    }

    case "state": {
      switch (value) {
        case "new":
          return "nou noi new";

        case "used":
          return "second hand folosit folosite used";

        default:
          return normalizeSearchText(value);
      }
    }

    case "wheels_rims": {
      switch (value) {
        case "parts-wheels-rims-type-steel":
          return "otel steel";

        case "parts-wheels-rims-type-alloy":
          return "aliaj alloy";

        default:
          return normalizeSearchText(value);
      }
    }

    case "donor_make":
    case "tire_brand":
      return [
        normalizeSearchText(value),
        normalizeSearchText(formatBrand(value)),
      ].join(" ");

    case "rims_inches":
    case "tyres_inches":
      return [normalizeSearchText(value), getRimSize(ad) ?? ""]
        .filter(Boolean)
        .join(" ");

    case "tyres_width":
      return [normalizeSearchText(value), formatTyreWidth(value) ?? ""]
        .filter(Boolean)
        .join(" ");

    case "tyres_profile":
      return [normalizeSearchText(value), formatTyresProfile(value) ?? ""]
        .filter(Boolean)
        .join(" ");

    default:
      return normalizeSearchText(value);
  }
}

//creates searchable text that contains the title, description and the
//human readbale versions of advert attributes
function buildSearchText(ad: WheelAdProps): string {
  const parts: string[] = [ad.title, ad.description];

  // General attributes
  const state = getState(ad);
  if (state) {
    parts.push(state);
  }

  const wheelType = getWheelType(ad);
  if (wheelType) {
    parts.push(wheelType);
  }

  // Rim size
  const rimSize = getRimSize(ad);
  if (rimSize) {
    parts.push(`r${rimSize}`);
    parts.push(rimSize);
  }

  // Tyre season
  const tyreType = getAttribute(ad, "tyres_type");
  if (tyreType) {
    parts.push(formatSeason(tyreType));
  }

  // Tyre dimensions
  const width = getAttribute(ad, "tyres_width");
  if (width) {
    const formattedWidth = formatTyreWidth(width);

    if (formattedWidth) {
      parts.push(formattedWidth);
    }
  }

  const profile = getAttribute(ad, "tyres_profile");
  if (profile) {
    const formattedProfile = formatTyresProfile(profile);

    if (formattedProfile) {
      parts.push(formattedProfile);
    }
  }

  // Brands / makes
  const tyreBrand = getAttribute(ad, "tire_brand");
  if (tyreBrand) {
    parts.push(tyreBrand);
  }

  const donorMake = getAttribute(ad, "donor_make");
  if (donorMake) {
    parts.push(donorMake);
  }

  // Include all raw attributes as fallback.
  for (const attribute of ad.attributes) {
    const value = getSearchableAttributeValue(ad, attribute.code);

    if (!value) {
      continue;
    }

    parts.push(`${attribute.code} ${value}`);
  }

  return parts.filter(Boolean).map(normalizeSearchText).join(" ");
}

//query parsing
function detectSeason(term: string): SearchSeason | undefined {
  switch (normalizeSearchText(term)) {
    case "iarna":
    case "winter":
      return "winter";

    case "vara":
    case "summer":
      return "summer";

    case "allseason":
    case "all season":
    case "all-season":
      return "allseason";

    default:
      return undefined;
  }
}

function detectState(term: string): SearchState | undefined {
  switch (normalizeSearchText(term)) {
    case "nou":
    case "noi":
    case "noua":
    case "new":
      return "new";

    case "second":
    case "second hand":
    case "folosit":
    case "folosite":
    case "used":
      return "used";

    default:
      return undefined;
  }
}

function detectCategory(term: string): SearchCategory | undefined {
  switch (normalizeSearchText(term)) {
    case "anvelopa":
    case "anvelope":
    case "cauciuc":
    case "cauciucuri":
    case "cauciucurile":
    case "pneu":
    case "pneuri":
      return "tyres";

    case "janta":
    case "jante":
      return "rims";

    default:
      return undefined;
  }
}

function detectDimension(query: string): ParsedDimension | undefined {
  const normalized = normalizeSearchText(query).replace(/\s+/g, " ");

  //  supports: 205/55 R16 205/55r16 205/55/16 205 / 55 / 16 205 55 R16 205 55 16

  const fullMatch = normalized.match(
    /\b(\d{3})\s*[\/\s]\s*(\d{2})\s*(?:[\/\s]*r?\s*)(\d{2}(?:\.\d)?)\b/i,
  );

  if (fullMatch) {
    return {
      width: fullMatch[1],
      profile: fullMatch[2],
      diameter: fullMatch[3],
    };
  }

  //supports: 205/55 205 / 55

  const widthProfileMatch = normalized.match(/\b(\d{3})\s*[\/\s]\s*(\d{2})\b/);

  if (widthProfileMatch) {
    return {
      width: widthProfileMatch[1],
      profile: widthProfileMatch[2],
    };
  }

  //  supports: R16 r16

  const diameterMatch = normalized.match(/\br\s*(\d{2}(?:\.\d)?)\b/i);

  if (diameterMatch) {
    return {
      diameter: diameterMatch[1],
    };
  }

  return undefined;
}

function parseSearchQuery(query: string): ParsedSearchQuery {
  const normalizedQuery = normalizeSearchText(query);

  const dimension = detectDimension(normalizedQuery);

  //remove queries that are already interpreted
  const cleanedQuery = normalizedQuery
    //remove full dimensions (example): 205/55 R16 205/55r16 205/55/16 205 / 55 / 16 205 55 R16

    .replace(
      /\b\d{3}\s*[\/\s]\s*\d{2}\s*(?:[\/\s]*r?\s*)\d{2}(?:\.\d)?\b/gi,
      " ",
    )

    //remove partial width/profile: 205/55 205 / 55205 55

    .replace(/\b\d{3}\s*[\/\s]\s*\d{2}\b/gi, " ")

    //remove standalone diameter: R16

    .replace(/\br\s*\d{2}(?:\.\d)?\b/gi, " ");

  const rawTerms = cleanedQuery
    .split(/\s+/)
    .map(normalizeSearchText)
    .filter((word) => word.length > 0 && !STOP_WORDS.has(word));

  let season: SearchSeason | undefined;
  let state: SearchState | undefined;
  let category: SearchCategory | undefined;

  const textTerms: string[] = [];

  for (const term of rawTerms) {
    const detectedSeason = detectSeason(term);

    if (detectedSeason) {
      season = detectedSeason;
      continue;
    }

    const detectedState = detectState(term);

    if (detectedState) {
      state = detectedState;
      continue;
    }

    const detectedCategory = detectCategory(term);

    if (detectedCategory) {
      category = detectedCategory;
      textTerms.push(term);
      continue;
    }

    textTerms.push(term);
  }

  return {
    textTerms,
    season,
    state,
    category,
    dimension,
  };
}

//semantic filters
function matchesSeason(ad: WheelAdProps, season: SearchSeason): boolean {
  const value = getAttribute(ad, "tyres_type");

  switch (season) {
    case "winter":
      return value === "parts-tyres-type-winter";

    case "summer":
      return value === "parts-tyres-type-summer";

    case "allseason":
      return value === "parts-tyres-type-allseason";

    default:
      return true;
  }
}

function matchesState(ad: WheelAdProps, state: SearchState): boolean {
  const value = getAttribute(ad, "state");

  switch (state) {
    case "new":
      return value === "new";

    case "used":
      return value === "used";

    default:
      return true;
  }
}

function matchesWidth(ad: WheelAdProps, width: string): boolean {
  const value = getAttribute(ad, "tyres_width");

  if (!value) {
    return false;
  }

  const formatted = formatTyreWidth(value);

  return value === width || formatted === width;
}

function matchesProfile(ad: WheelAdProps, profile: string): boolean {
  const value = getAttribute(ad, "tyres_profile");

  if (!value) {
    return false;
  }

  const formatted = formatTyresProfile(value);

  return value === profile || formatted === profile;
}

function matchesDiameter(ad: WheelAdProps, diameter: string): boolean {
  const rimInches = getAttribute(ad, "rims_inches");
  const tyreInches = getAttribute(ad, "tyres_inches");

  const formattedRim = rimInches ? getRimSize(ad) : undefined;

  const formattedTyre = tyreInches
    ? getRimSizeFromTyreAttribute(tyreInches)
    : undefined;

  return (
    rimInches === diameter ||
    tyreInches === diameter ||
    formattedRim === diameter ||
    formattedTyre === diameter
  );
}

function getRimSizeFromTyreAttribute(value: string): string | undefined {
  const match = value.match(/parts-tyres-inches-(\d+(?:-\d+)?)$/);

  if (!match) {
    return undefined;
  }

  return match[1].replace("-", ".");
}

function matchesDimension(
  ad: WheelAdProps,
  dimension: ParsedDimension,
): boolean {
  if (dimension.width && !matchesWidth(ad, dimension.width)) {
    return false;
  }

  if (dimension.profile && !matchesProfile(ad, dimension.profile)) {
    return false;
  }

  if (dimension.diameter && !matchesDiameter(ad, dimension.diameter)) {
    return false;
  }

  return true;
}

//category helpers

function hasTyreCategory(categoryId: number): boolean {
  return categoryId === 1649;
}

function hasRimCategory(categoryId: number): boolean {
  return categoryId === 1647;
}

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
    query,
    sortBy = "createdAt",
    order = "desc",
  } = params;

  console.log(params);
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

    if (query && query.trim() !== "") {
      const parsedQuery = parseSearchQuery(query);

      //check for category

      if (!category && parsedQuery.category) {
        if (parsedQuery.category === "tyres") {
          ads = ads.filter((ad) => hasTyreCategory(ad.category_id));
        }

        if (parsedQuery.category === "rims") {
          ads = ads.filter((ad) => hasRimCategory(ad.category_id));
        }
      }

      //check for tyres season

      if (parsedQuery.season && !season) {
        ads = ads.filter((ad) => {
          if (!hasTyreCategory(ad.category_id)) {
            return false;
          }

          return matchesSeason(ad, parsedQuery.season!);
        });
      }

      //check for state

      if (parsedQuery.state && !state) {
        ads = ads.filter((ad) => matchesState(ad, parsedQuery.state!));
      }

      //check for dimensions (both tyres and rims category - but only for diameter)

      if (parsedQuery.dimension) {
        ads = ads.filter((ad) => {
          const dimension = parsedQuery.dimension!;

          if (dimension.width || dimension.profile) {
            if (!hasTyreCategory(ad.category_id)) {
              return false;
            }

            return matchesDimension(ad, dimension);
          }

          return matchesDimension(ad, dimension);
        });
      }

      //fuzzy text search

      if (parsedQuery.textTerms.length > 0) {
        const searchableAds: SearchableWheelAd[] = ads.map((ad) => ({
          ...ad,
          searchText: buildSearchText(ad),
        }));

        const fuseOptions = {
          isCaseSensitive: false,

          threshold: 0.3,

          ignoreLocation: true,
          ignoreFieldNorm: true,

          useExtendedSearch: true,

          keys: [
            {
              name: "title",
              weight: 0.7,
            },
            {
              name: "searchText",
              weight: 0.3,
            },
          ],

          getFn: (ad: SearchableWheelAd, path: string | string[]) => {
            const propertyPath = Array.isArray(path) ? path[0] : path;

            const value = (ad as Record<string, unknown>)[propertyPath];

            return typeof value === "string" ? normalizeSearchText(value) : "";
          },
        };

        const fuse = new Fuse(searchableAds, fuseOptions);

        const logicalQuery = {
          $and: parsedQuery.textTerms.map((term) => {
            const variants = Array.from(
              new Set([term, ...(SEARCH_SYNONYMS[term] ?? [])]),
            );

            return {
              $or: variants.map((variant) => ({
                $or: [
                  {
                    title: variant,
                  },
                  {
                    searchText: variant,
                  },
                ],
              })),
            };
          }),
        } as Expression;

        const results = fuse.search(logicalQuery);

        ads = results.map((result) => result.item);
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
