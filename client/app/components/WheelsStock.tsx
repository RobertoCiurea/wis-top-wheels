import "@/app/styles/stock.css";

import { WheelAdProps } from "../types/types";
import WheelAdvertCard from "./WheelAdvertCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const WheelsStock = ({
  wheelAdverts,
  mainPage = false,
}: {
  wheelAdverts: WheelAdProps[];
  mainPage?: boolean;
}) => {
  return (
    <div
      className="section"
      id="stock"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
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
            <div className="eyebrow">Disponibile acum</div>
            <h2 className="display d2" id="wheels-heading">
              Jante & <span className="accent">Anvelope</span>
            </h2>
          </div>
        </div>
        {wheelAdverts.length > 0 ? (
          <div className="stock-grid reveal visible">
            {wheelAdverts.map((advert, index) => (
              <WheelAdvertCard advert={advert} key={index} />
            ))}
          </div>
        ) : (
          <h1>Stoc epuizat</h1>
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
        {!mainPage && (
          //Page button (1, 2, 3, .... )
          <></>
        )}
      </div>
    </div>
  );
};
