import "@/app/styles/stock.css";

import { WheelAdProps } from "../types/types";
import {
  WheelAdvertCard,
  WheelAdvertFilters,
  Pagination,
} from "@/app/components/components";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const WheelsStock = ({
  wheelAdverts,
  mainPage = false,
  dashboardPage = false,
  total,
  limit,
}: {
  wheelAdverts: WheelAdProps[] | undefined;
  mainPage?: boolean;
  dashboardPage?: boolean;
  total?: number;
  limit?: number;
}) => {
  return (
    <div
      className="section"
      id="stock"
      style={{
        background: `${dashboardPage ? "" : "var(--surface)"}`,
        borderTop: `${dashboardPage ? "none" : "1px solid var(--border)"}`,
        paddingTop: `${mainPage ? "" : dashboardPage ? "" : "150px"}`,
      }}
      aria-labelledby="wheels-heading"
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <div className="reveal visible">
            {mainPage && <div className="eyebrow">Disponibile acum</div>}
            <h2 className="display d2" id="wheels-heading">
              Jante & <span className="accent">Anvelope</span>
            </h2>

            <h3 className="display d4" style={{ padding: ".5rem 0" }}>
              <span className="accent">{total}</span> anunțuri
            </h3>
            {!mainPage && <WheelAdvertFilters />}
          </div>
        </div>
        {wheelAdverts && wheelAdverts.length > 0 ? (
          <div className="stock-grid reveal visible">
            {wheelAdverts.map((advert, index) => (
              <WheelAdvertCard advert={advert} key={index} />
            ))}
          </div>
        ) : (
          <div
            className="stock-empty reveal visible"
            role="status"
            aria-live="polite"
          >
            <div className="stock-empty__icon" aria-hidden="true">
              <span>•</span>
            </div>
            <div className="eyebrow stock-empty__eyebrow">Stoc temporar</div>
            <h3 className="stock-empty__title">
              Momentan nu avem jante, roți sau anvelope disponibile
            </h3>
            <p className="stock-empty__text">
              Verificăm constant noul stoc și ne poți contacta pentru a afla
              despre următoarele sosiri sau pentru a găsi un model potrivit
              nevoilor tale.
            </p>
            <div className="stock-empty__actions">
              <a href="#contact-section" className="btn btn-gold">
                Solicită un model
              </a>
              <a href="https://wa.me/40726547517" className="btn btn-ghost">
                Scrie pe WhatsApp
              </a>
            </div>
          </div>
        )}
        {mainPage && (
          <div className="stock-actions">
            <Link
              href="/anunturi/jante-si-roti?page=1"
              className="btn btn-ghost stock-link"
            >
              Vezi tot stocul
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        )}
        {!mainPage && <Pagination total={total} limit={limit} />}
      </div>
    </div>
  );
};
