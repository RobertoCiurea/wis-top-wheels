import Image from "next/image";
import "@/app/styles/stock.css";
import Bmw from "@/public/images/bmw-320.jpg";
import Mercedes from "@/public/images/mercedes-cla-200.jpg";
import Audi from "@/public/images/audi-a4-avant.jpg";
export const CarsStock = () => {
  return (
    <div className="section" id="cars" aria-labelledby="cars-heading">
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
            <div className="eyebrow">Import Germania</div>
            <h2 className="display d2" id="cars-heading">
              Mașini de <span className="accent">vânzare</span>
            </h2>
          </div>
          <a href="#contact-section" className="btn btn-ghost reveal">
            Contactează-ne →
          </a>
        </div>
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
            Momentan nu avem mașini disponibile
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
      </div>
    </div>
  );
};
