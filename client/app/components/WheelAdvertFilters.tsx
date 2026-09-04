"use client";

import { SubmitEvent, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";
import "@/app/styles/filters.css";
import { WheelAdvertFilterValues } from "../types/types";
import { Modal } from "./Modal";

const FILTER_KEYS: (keyof WheelAdvertFilterValues)[] = [
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
];

const emptyFilters: WheelAdvertFilterValues = {
  category: "",
  maxPrice: "",
  state: "",
  diameter: "",
  make: "",
  material: "",
  tyreBrand: "",
  season: "",
  width: "",
  profile: "",
  sortBy: "",
  order: "",
};

function filtersFromParams(params: URLSearchParams): WheelAdvertFilterValues {
  return FILTER_KEYS.reduce(
    (filters, key) => ({ ...filters, [key]: params.get(key) ?? "" }),
    { ...emptyFilters },
  );
}

export const WheelAdvertFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<WheelAdvertFilterValues>(() =>
    filtersFromParams(searchParams),
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  const openFilterModal = useCallback(() => {
    setIsFilterOpen(true);
    setIsSortingOpen(false);
  }, []);
  const closeFilterModal = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const openSortingModal = useCallback(() => {
    setIsSortingOpen(true);
    setIsFilterOpen(false);
  }, []);
  const closeSortingModal = useCallback(() => {
    setIsSortingOpen(false);
  }, []);
  const CATEGORY = [
    { code: "1647", label: "Jante și roți" },
    { code: "1649", label: "Anvelope" },
  ];

  const STATE = [
    { code: "new", label: "Noua" },
    { code: "used", label: "Second hand" },
  ];
  const RIM_DIAMETER = [
    {
      code: "parts-rims-inches-12",
      label: "12 inch si sub",
    },
    {
      code: "parts-rims-inches-13",
      label: "13",
    },
    {
      code: "parts-rims-inches-14",
      label: "14",
    },
    {
      code: "parts-rims-inches-15",
      label: "15",
    },
    {
      code: "parts-rims-inches-16",
      label: "16",
    },
    {
      code: "parts-rims-inches-16-5",
      label: "16,5",
    },
    {
      code: "parts-rims-inches-17",
      label: "17",
    },
    {
      code: "parts-rims-inches-17-5",
      label: "17,5",
    },
    {
      code: "parts-rims-inches-18",
      label: "18",
    },
    {
      code: "parts-rims-inches-19",
      label: "19",
    },
    {
      code: "parts-rims-inches-19-5",
      label: "19,5",
    },
    {
      code: "parts-rims-inches-20",
      label: "20",
    },
    {
      code: "parts-rims-inches-21",
      label: "21",
    },
    {
      code: "parts-rims-inches-22",
      label: "22 inch si peste",
    },
  ];

  const TYRE_DIAMETER = [
    {
      code: "parts-tyres-inches-12",
      label: "12 inch si sub",
    },
    {
      code: "parts-tyres-inches-13",
      label: "13",
    },
    {
      code: "parts-tyres-inches-14",
      label: "14",
    },
    {
      code: "parts-tyres-inches-15",
      label: "15",
    },
    {
      code: "parts-tyres-inches-16",
      label: "16",
    },
    {
      code: "parts-tyres-inches-16-5",
      label: "16,5",
    },
    {
      code: "parts-tyres-inches-17",
      label: "17",
    },
    {
      code: "parts-tyres-inches-17-5",
      label: "17,5",
    },
    {
      code: "parts-tyres-inches-18",
      label: "18",
    },
    {
      code: "parts-tyres-inches-19",
      label: "19",
    },
    {
      code: "parts-tyres-inches-19-5",
      label: "19,5",
    },
    {
      code: "parts-tyres-inches-20",
      label: "20",
    },
    {
      code: "parts-tyres-inches-21",
      label: "21",
    },
    {
      code: "parts-tyres-inches-22",
      label: "22 inch si peste",
    },
  ];

  const RIM_BRANDS = [
    "Abarth",
    "Acura",
    "Aigo",
    "Aiways",
    "Aixam",
    "Alfa Romeo",
    "Allview",
    "Alpine",
    "AONEW",
    "Aro",
    "Aston Martin",
    "Audi",
    "Austin",
    "AVATR",
    "Baic",
    "Baw",
    "Beauford",
    "Bentley",
    "BMW",
    "Bronco Sport",
    "Bugatti",
    "Buick",
    "Byd",
    "Cadillac",
    "Cenntro",
    "Chatenet",
    "Chery",
    "Chevrolet",
    "Chrysler",
    "Citroën",
    "Comarth",
    "Cupra",
    "Dacia",
    "Daewoo",
    "Daihatsu",
    "DFSK",
    "DKW",
    "Dodge",
    "Dongwei",
    "DR",
    "DS Automobiles",
    "e.GO",
    "Eagle",
    "Elaris",
    "Excalibur",
    "Ferrari",
    "Fiat",
    "Ford",
    "Forthing",
    "Geely",
    "Genesis",
    "GMC",
    "Gonow",
    "Grecav",
    "Haval",
    "Holden",
    "Honda",
    "Hongqi",
    "Hummer",
    "Hyundai",
    "IM Motors",
    "Ineos",
    "Infiniti",
    "Isuzu",
    "Iveco",
    "JAC",
    "Jaecoo",
    "Jaguar",
    "Jeep",
    "Jetour",
    "Kaipan",
    "KGM",
    "Kia",
    "Koenigsegg",
    "KTM X-Bow",
    "Lada",
    "Lamborghini",
    "Lancia",
    "Land Rover",
    "Leapmotor",
    "Lexus",
    "Li Auto",
    "Ligier",
    "Lincoln",
    "LINKTOUR",
    "Lomax",
    "Lotus",
    "LuAZ",
    "Lucid",
    "Lynk&Co",
    "Mahindra",
    "Maruti",
    "Maserati",
    "Maxus",
    "Maybach",
    "Mazda",
    "McLaren",
    "Mercedes-Benz",
    "Mercury",
    "MG",
    "Microcar",
    "Microlino",
    "Mini",
    "Mitsubishi",
    "Morgan",
    "MPM Motors",
    "Nio",
    "Nissan",
    "NSU",
    "Nysa",
    "Oldsmobile",
    "Omoda",
    "Onvo",
    "Opel",
    "Peugeot",
    "Plymouth",
    "Polestar",
    "Polonez",
    "Pontiac",
    "Porsche",
    "Proton",
    "Prototip",
    "RDB",
    "Relive",
    "Renault",
    "Rivian",
    "Rolls-Royce",
    "Rover",
    "Saab",
    "Samsung",
    "Saturn",
    "Seat",
    "Seres",
    "Simca",
    "Skoda",
    "Skywell",
    "Smart",
    "Smart Balance",
    "SsangYong",
    "Stelato",
    "Studebaker",
    "Subaru",
    "Suda",
    "Suzuki",
    "SWM",
    "Syrena",
    "Tarpan",
    "Tata",
    "Tatra",
    "Tavria",
    "Tazzari",
    "Tesla",
    "Today Sunshine",
    "Toyota",
    "Trabant",
    "Triumph",
    "TVR",
    "Vauxhall",
    "Volkswagen",
    "Volvo",
    "Warszawa",
    "Xev",
    "Xiaomi",
    "Xpeng",
    "Yugo",
    "Zaporożec",
    "Zastawa",
    "Zeekr",
    "Altul",
  ];

  const RIM_MATERIAL = [
    {
      code: "parts-wheels-rims-type-alloy",
      label: "Aliaj",
    },
    {
      code: "parts-wheels-rims-type-steel",
      label: "Otel",
    },
  ];

  const TYRE_BRANDS = [
    "Accelera",
    "Achilles",
    "Alliance",
    "Apollo",
    "Atlas",
    "Austone",
    "Avon",
    "Barum",
    "BFGoodrich",
    "BKT",
    "Bridgestone",
    "Ceat",
    "Comforser",
    "Continental",
    "Cooper",
    "Cultor",
    "Dayton",
    "Debica",
    "Dunlop",
    "Duro",
    "Evergreen",
    "Falken",
    "Federal",
    "Firestone",
    "Fortuna",
    "Fortune",
    "Fulda",
    "General",
    "Gislaved",
    "Goodride",
    "Goodyear",
    "Gripmax",
    "GT Radial",
    "Hankook",
    "Heidenau",
    "Hifly",
    "Imperial",
    "Infinity",
    "Interstate",
    "Kabat",
    "Kama",
    "Kenda",
    "Kingstar",
    "Kleber",
    "Kormoran",
    "Kumho",
    "Laufenn",
    "Linglong",
    "LongMarch",
    "Mabor",
    "Marangoni",
    "Matador",
    "Maxxis",
    "Metzeler",
    "Michelin",
    "Minerva",
    "Mitas",
    "Motoz",
    "Nankang",
    "Nexen",
    "Nokian",
    "Nordexx",
    "Altul",
    "Paxaro",
    "Petlas",
    "Pirelli",
    "Platin",
    "Point S",
    "Powertrac",
    "Premiorri",
    "Prestivo",
    "Profil",
    "Riken",
    "Rockstone",
    "Rotalla",
    "Saetta",
    "Sailun",
    "Sava",
    "Seiberling",
    "Semperit",
    "Shinko",
    "Speedways",
    "Sportiva",
    "Stomil",
    "Sunf",
    "Sunny",
    "Taurus",
    "Tigar",
    "Torque",
    "Toyo",
    "Trayal",
    "Trelleborg",
    "Triangle",
    "Trottar",
    "TVS",
    "Uniroyal",
    "Viking",
    "Voltyre",
    "Vredestein",
    "Wanli",
  ];

  const TYRE_SEASON = [
    {
      code: "parts-tyres-type-allseason",
      label: "Pentru toate sezoanele",
    },
    {
      code: "parts-tyres-type-summer",
      label: "Anvelope de vara",
    },
    {
      code: "parts-tyres-type-winter",
      label: "Anvelope de iarna",
    },
  ];

  const TYRE_WIDTH = [
    {
      code: "parts-tyres-width-125",
      label: "125",
    },
    {
      code: "parts-tyres-width-135",
      label: "135",
    },
    {
      code: "parts-tyres-width-145",
      label: "145",
    },
    {
      code: "parts-tyres-width-155",
      label: "155",
    },
    {
      code: "parts-tyres-width-165",
      label: "165",
    },
    {
      code: "parts-tyres-width-175",
      label: "175",
    },
    {
      code: "parts-tyres-width-185",
      label: "185",
    },
    {
      code: "parts-tyres-width-195",
      label: "195",
    },
    {
      code: "parts-tyres-width-205",
      label: "205",
    },
    {
      code: "parts-tyres-width-215",
      label: "215",
    },
    {
      code: "parts-tyres-width-225",
      label: "225",
    },
    {
      code: "parts-tyres-width-235",
      label: "235",
    },
    {
      code: "parts-tyres-width-245",
      label: "245",
    },
    {
      code: "parts-tyres-width-255",
      label: "255",
    },
    {
      code: "parts-tyres-width-265",
      label: "265",
    },
    {
      code: "parts-tyres-width-275",
      label: "275",
    },
    {
      code: "parts-tyres-width-285",
      label: "285",
    },
    {
      code: "parts-tyres-width-295",
      label: "295",
    },
    {
      code: "parts-tyres-width-305",
      label: "305",
    },
    {
      code: "parts-tyres-width-315",
      label: "315",
    },
    {
      code: "parts-tyres-width-325",
      label: "325",
    },
    {
      code: "parts-tyres-width-335",
      label: "335",
    },
    {
      code: "parts-tyres-width-345",
      label: "345",
    },
    {
      code: "parts-tyres-width-355",
      label: "355",
    },
    {
      code: "parts-tyres-width-another",
      label: "Altele",
    },
    {
      code: "parts-tyres-width-30",
      label: "30",
    },
    {
      code: "parts-tyres-width-31",
      label: "31",
    },
    {
      code: "parts-tyres-width-32",
      label: "32",
    },
    {
      code: "parts-tyres-width-33",
      label: "33",
    },
    {
      code: "parts-tyres-width-35",
      label: "35",
    },
    {
      code: "parts-tyres-width-37",
      label: "37",
    },
    {
      code: "parts-tyres-width-5",
      label: "5.00",
    },
    {
      code: "parts-tyres-width-6",
      label: "6.00",
    },
    {
      code: "parts-tyres-width-7",
      label: "7.00",
    },
    {
      code: "parts-tyres-width-7-5",
      label: "7.50",
    },
  ];

  const TYRE_PROFILE = [
    {
      code: "parts-tyres-profile-7",
      label: "7",
    },
    {
      code: "parts-tyres-profile-9-5",
      label: "9.5",
    },
    {
      code: "parts-tyres-profile-10-5",
      label: "10.5",
    },
    {
      code: "parts-tyres-profile-11-5",
      label: "11.5",
    },
    {
      code: "parts-tyres-profile-12-5",
      label: "12.5",
    },
    {
      code: "parts-tyres-profile-25",
      label: "25",
    },
    {
      code: "parts-tyres-profile-30",
      label: "30",
    },
    {
      code: "parts-tyres-profile-35",
      label: "35",
    },
    {
      code: "parts-tyres-profile-40",
      label: "40",
    },
    {
      code: "parts-tyres-profile-45",
      label: "45",
    },
    {
      code: "parts-tyres-profile-50",
      label: "50",
    },
    {
      code: "parts-tyres-profile-55",
      label: "55",
    },
    {
      code: "parts-tyres-profile-60",
      label: "60",
    },
    {
      code: "parts-tyres-profile-65",
      label: "65",
    },
    {
      code: "parts-tyres-profile-70",
      label: "70",
    },
    {
      code: "parts-tyres-profile-75",
      label: "75",
    },
    {
      code: "parts-tyres-profile-80",
      label: "80",
    },
    {
      code: "parts-tyres-profile-85",
      label: "85",
    },
    {
      code: "parts-tyres-profile-another",
      label: "Altele",
    },
  ];

  const SORT_BY = [
    { code: "price", label: "Preț" },
    { code: "date", label: "Dată" },
  ];
  const ORDER = [
    { code: "asc", label: "Crescător" },
    { code: "desc", label: "Descrescător" },
  ];

  const updateFilter = (key: keyof WheelAdvertFilterValues, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams({ page: "1" });
    FILTER_KEYS.forEach((key) => {
      if (filters[key]) params.set(key, filters[key]);
    });
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
    setIsSortingOpen(false);
  };

  const handleReset = () => {
    setFilters({ ...emptyFilters });
    router.push(`${pathname}?page=1`);
  };

  const renderOptions = (options: { code: string; label: string }[]) =>
    options.map((option) => (
      <option key={option.code} value={option.code}>
        {option.label}
      </option>
    ));
  const renderStringOptions = (options: string[]) =>
    options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));

  const diameterOptions =
    filters.category === "1647"
      ? RIM_DIAMETER
      : filters.category === "1649"
        ? TYRE_DIAMETER
        : [];

  return (
    <div className="filters-container">
      <div className="filters-toolbar" aria-label="Opțiuni listă anunțuri">
        <div className="filters-buttons">
          <button
            type="button"
            className={`filters-toolbar-button ${isFilterOpen ? "active" : ""}`}
            onClick={openFilterModal}
            aria-label="Deschide filtrele"
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            <span>Filtre</span>
          </button>
        </div>
        <button
          type="button"
          className={`filters-toolbar-button ${isSortingOpen ? "active" : ""}`}
          onClick={openSortingModal}
          aria-label="Deschide sortarea"
        >
          <ArrowDownUp size={18} aria-hidden="true" />
          <span>Sortare</span>
        </button>
      </div>

      <Modal
        isOpen={isSortingOpen}
        onClose={closeSortingModal}
        maxWidth="720px"
      >
        <section className="filters-shell" aria-labelledby="filters-title">
          <div className="filters-heading">
            <div>
              <p className="filters-eyebrow">Caută în stoc</p>
              <h2 id="filters-title" className="display d4">
                Sortare anunțuri
              </h2>
            </div>
          </div>
          <form className="filters-form" onSubmit={handleSubmit}>
            <div className="filters-sorting filters-sorting-modal">
              <div className="filters-sorting-title">Sortare rezultate</div>
              <div className="filters-sorting-grid">
                <FilterField label="Sortează după" name="sortBy">
                  <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={(event) =>
                      updateFilter("sortBy", event.target.value)
                    }
                  >
                    <option value="">Implicit</option>
                    {renderOptions(SORT_BY)}
                  </select>
                </FilterField>
                <FilterField label="Ordine" name="order">
                  <select
                    id="order"
                    name="order"
                    value={filters.order}
                    onChange={(event) =>
                      updateFilter("order", event.target.value)
                    }
                  >
                    <option value="">Implicită</option>
                    {renderOptions(ORDER)}
                  </select>
                </FilterField>
              </div>
            </div>
            <div className="filters-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleReset}
              >
                Resetează
              </button>
              <button type="submit" className="btn btn-gold">
                Sortează
              </button>
            </div>
          </form>
        </section>
      </Modal>
      <Modal isOpen={isFilterOpen} onClose={closeFilterModal} maxWidth="720px">
        <section className="filters-shell" aria-labelledby="filters-title">
          <div className="filters-heading">
            <div>
              <p className="filters-eyebrow">Caută în stoc</p>
              <h2 id="filters-title" className="display d4">
                Filtre anunțuri
              </h2>
            </div>
          </div>
          <form className="filters-form" onSubmit={handleSubmit}>
            <div className="filters-grid">
              <FilterField label="Categorie" name="category">
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={(event) => {
                    setFilters((current) => ({
                      ...current,
                      category: event.target.value,
                      diameter: "",
                    }));
                  }}
                >
                  <option value="">Toate categoriile</option>
                  {renderOptions(CATEGORY)}
                </select>
              </FilterField>
              <FilterField label="Preț maxim" name="maxPrice">
                <input
                  id="maxPrice"
                  name="maxPrice"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="Orice preț"
                  value={filters.maxPrice}
                  onChange={(event) =>
                    updateFilter("maxPrice", event.target.value)
                  }
                />
                <span className="filters-unit">RON</span>
              </FilterField>
              <FilterField label="Stare" name="state">
                <select
                  id="state"
                  name="state"
                  value={filters.state}
                  onChange={(event) =>
                    updateFilter("state", event.target.value)
                  }
                >
                  <option value="">Orice stare</option>
                  {renderOptions(STATE)}
                </select>
              </FilterField>
              <FilterField label="Diametru" name="diameter">
                <select
                  id="diameter"
                  name="diameter"
                  value={filters.diameter}
                  onChange={(event) =>
                    updateFilter("diameter", event.target.value)
                  }
                >
                  <option value="">
                    {filters.category
                      ? "Orice diametru"
                      : "Selectează categoria"}
                  </option>
                  {renderOptions(diameterOptions)}
                </select>
              </FilterField>
              <FilterField label="Marcă jantă" name="make">
                <select
                  id="make"
                  name="make"
                  value={filters.make}
                  onChange={(event) => updateFilter("make", event.target.value)}
                >
                  <option value="">Orice marcă</option>
                  {renderStringOptions(RIM_BRANDS)}
                </select>
              </FilterField>
              <FilterField label="Material" name="material">
                <select
                  id="material"
                  name="material"
                  value={filters.material}
                  onChange={(event) =>
                    updateFilter("material", event.target.value)
                  }
                >
                  <option value="">Orice material</option>
                  {renderOptions(RIM_MATERIAL)}
                </select>
              </FilterField>
              <FilterField label="Marcă anvelopă" name="tyreBrand">
                <select
                  id="tyreBrand"
                  name="tyreBrand"
                  value={filters.tyreBrand}
                  onChange={(event) =>
                    updateFilter("tyreBrand", event.target.value)
                  }
                >
                  <option value="">Orice marcă</option>
                  {renderStringOptions(TYRE_BRANDS)}
                </select>
              </FilterField>
              <FilterField label="Sezon" name="season">
                <select
                  id="season"
                  name="season"
                  value={filters.season}
                  onChange={(event) =>
                    updateFilter("season", event.target.value)
                  }
                >
                  <option value="">Orice sezon</option>
                  {renderOptions(TYRE_SEASON)}
                </select>
              </FilterField>
              <FilterField label="Lățime" name="width">
                <select
                  id="width"
                  name="width"
                  value={filters.width}
                  onChange={(event) =>
                    updateFilter("width", event.target.value)
                  }
                >
                  <option value="">Orice lățime</option>
                  {renderOptions(TYRE_WIDTH)}
                </select>
              </FilterField>
              <FilterField label="Profil" name="profile">
                <select
                  id="profile"
                  name="profile"
                  value={filters.profile}
                  onChange={(event) =>
                    updateFilter("profile", event.target.value)
                  }
                >
                  <option value="">Orice profil</option>
                  {renderOptions(TYRE_PROFILE)}
                </select>
              </FilterField>
            </div>

            <div className="filters-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleReset}
              >
                Resetează
              </button>
              <button type="submit" className="btn btn-gold">
                Aplică filtrele
              </button>
            </div>
          </form>
        </section>
      </Modal>
    </div>
  );
};

function FilterField({
  label,
  name,
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <div className="filters-field">
      <label htmlFor={name}>{label}</label>
      <div className="filters-control">{children}</div>
    </div>
  );
}
