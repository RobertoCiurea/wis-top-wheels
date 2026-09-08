"use client";

import { SubmitEvent, Suspense, useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, SlidersHorizontal, Search, X } from "lucide-react";
import "@/app/styles/filters.css";
import { WheelAdvertFilterValues } from "../types/types";
import { Modal } from "./Modal";
import { FilterField } from "./FilterField";
import { FiltersGrid } from "./FiltersGrid";
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
  "query",
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
  query: "",
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
  return (
    <Suspense
      fallback={
        <div
          className="filters-container filters-container--loading"
          aria-live="polite"
        >
          <div className="filters-toolbar">
            <button
              type="button"
              className="filters-toolbar-button"
              aria-label="Încărcare filtre"
            >
              <SlidersHorizontal size={18} aria-hidden="true" />
              <span>Filtre</span>
            </button>
          </div>
        </div>
      }
    >
      <WheelAdvertFiltersInner />
    </Suspense>
  );
};

function WheelAdvertFiltersInner() {
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
  const resetQuery = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query: "",
    }));
  };

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      query: event.target.value,
    }));
  };
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
        <form onSubmit={handleSubmit} className="query-form" role="search">
          <div className="query-input-content">
            <input
              type="search"
              name="query"
              className="query-input"
              placeholder="Caută anunțuri..."
              value={filters.query}
              onChange={onChangeQuery}
              autoComplete="off"
              aria-label="Caută în anunțuri"
            />
            <button
              type="button"
              className="reset-query-button"
              onClick={resetQuery}
              disabled={!filters.query}
              aria-label="Șterge căutarea"
              title="Șterge căutarea"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <button
            type="submit"
            className="filters-toolbar-button query-submit-button"
          >
            <Search size={18} aria-hidden="true" />
            <span>Caută</span>
          </button>
        </form>
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
            <FiltersGrid filters={filters} setFilters={setFilters} />
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
}
