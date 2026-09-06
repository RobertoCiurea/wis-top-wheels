"use client";
import { SubmitEventHandler, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, Funnel } from "lucide-react";
import "@/app/styles/searchbar.css";
import { FiltersGrid } from "@/app/components/components";
import { WheelAdvertFilterValues } from "../types/types";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
const PRODUCT_MENU_ITEMS = [
  { href: "/#stock", label: "Jante & Anvelope" },
  { href: "/#cars", label: "Mașini de vânzare" },
  { href: "/#services", label: "Servicii" },
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
function filtersFromParams(params: URLSearchParams): WheelAdvertFilterValues {
  return FILTER_KEYS.reduce(
    (filters, key) => ({ ...filters, [key]: params.get(key) ?? "" }),
    { ...emptyFilters },
  );
}

export const MenuSearchBar = () => {
  const searchParams = useSearchParams();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<WheelAdvertFilterValues>(() =>
    filtersFromParams(searchParams),
  );
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef(new URLSearchParams());
  const router = useRouter();
  const toggleProduct = (open: boolean) => {
    setIsFiltersOpen(false);
    setIsProductsOpen(!open);
  };

  const toggleFilters = (open: boolean) => {
    setIsProductsOpen(false);
    setIsFiltersOpen(!open);
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
        setIsFiltersOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProductsOpen(false);
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleFilters = () => {
    FILTER_KEYS.forEach((key) => {
      if (filters[key]) paramsRef.current.set(key, filters[key]);
    });
    setIsFiltersOpen(false);
    toast.success(
      "Filtrele au fost aplicate cu succes. Apasă pe butonul de căutare pentru a vedea rezultatele.",
    );
  };

  const handleReset = () => {
    setFilters({ ...emptyFilters });
    FILTER_KEYS.forEach((key) => paramsRef.current.delete(key));
    setIsFiltersOpen(false);
    toast.success("Filtrele au fost resetate cu succes.");
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (query && query.trim() !== "") {
      paramsRef.current.set("query", query);
    }
    router.push(
      `/anunturi/jante-si-roti?page=1&${paramsRef.current.toString()}`,
    );
  };
  return (
    <div className="menu-search-bar" ref={menuRef}>
      <ul className="menu-search-bar__list">
        <li className="menu-search-bar__item menu-search-bar__item--menu">
          <button
            type="button"
            className="menu-search-bar__trigger"
            aria-expanded={isProductsOpen}
            aria-haspopup="menu"
            aria-controls="products-menu"
            onClick={() => toggleProduct(isProductsOpen)}
          >
            <span className="menu-search-bar__item-content">
              <Menu size={16} />
              <span>Produse</span>
            </span>
            <ChevronDown
              size={16}
              className={`menu-search-bar__chevron ${isProductsOpen ? "open" : ""}`}
            />
          </button>

          <div
            id="products-menu"
            className={`menu-search-bar__dropdown ${isProductsOpen ? "open" : ""}`}
            role="menu"
            aria-label="Categorii produse"
          >
            {PRODUCT_MENU_ITEMS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                role="menuitem"
                onClick={() => setIsProductsOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </li>

        <li className="menu-search-bar__item menu-search-bar__item--filters">
          <button
            type="button"
            className="menu-search-bar__trigger"
            aria-expanded={isFiltersOpen}
            aria-haspopup="menu"
            aria-controls="filters-menu"
            onClick={() => toggleFilters(isFiltersOpen)}
          >
            <span className="menu-search-bar__item-content">
              <Funnel />
              <span>Filtre</span>
            </span>
            <ChevronDown
              size={16}
              className={`menu-search-bar__chevron ${isFiltersOpen ? "open" : ""}`}
            />
          </button>

          <div
            id="filters-menu"
            className={`menu-search-bar__dropdown-filters ${isFiltersOpen ? "open" : ""}`}
            role="menu"
            aria-label="Filtre rapide"
          >
            <div className="menu-search-bar__filters-placeholder">Filtre</div>
            <div className="menu-search-bar__filters-full">
              <form action="">
                <FiltersGrid filters={filters} setFilters={setFilters} />
                <div className="filters-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleReset}
                  >
                    Resetează
                  </button>
                  <button
                    type="button"
                    onClick={handleFilters}
                    className="btn btn-gold"
                  >
                    Aplică filtrele
                  </button>
                </div>
              </form>
            </div>
          </div>
        </li>
        <li className="menu-search-bar__item menu-search-bar__item--search">
          <form
            className="menu-search-bar__search-form"
            action=""
            name="query-form"
            id="query-form"
            onSubmit={handleSubmit}
          >
            <label className="menu-search-bar__search" htmlFor="query-advert">
              <Search size={16} />
              <input
                type="text"
                name="query"
                id="query-advert"
                placeholder="Caută anvelope sau jante..."
                aria-label="Cautare produse"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </form>
        </li>
        <button
          type="submit"
          form="query-form"
          className="menu-search-bar__search-button"
          aria-label="Caută produse"
        >
          <Search size={15} />
          <span>Caută</span>
        </button>
      </ul>
    </div>
  );
};
