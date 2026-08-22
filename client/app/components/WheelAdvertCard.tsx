"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, MapPin } from "lucide-react";
import Link from "next/link";
import { A11y, Pagination } from "swiper/modules";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { WheelAdProps } from "../types/types";

import "@/app/styles/wheel-ad-card.css";
import { id } from "zod/locales";

interface WheelAdvertCardProps {
  advert: WheelAdProps;

  href?: string;

  priority?: boolean;

  cityName?: string | "Pitesti";
}

function getAttribute(advert: WheelAdProps, code: string): string | undefined {
  return advert.attributes.find((attribute) => attribute.code === code)?.value;
}

function getWheelType(advert: WheelAdProps): string {
  const value = getAttribute(advert, "wheels_rims");

  switch (value) {
    case "parts-wheels-rims-type-steel":
      return "Oțel";

    case "parts-wheels-rims-type-alloy":
      return "Aliaj";

    default:
      return "Jante";
  }
}

function getRimSize(advert: WheelAdProps): string | undefined {
  const value = getAttribute(advert, "rims_inches");

  switch (value) {
    case "parts-rims-inches-13":
      return "13";
    case "parts-rims-inches-14":
      return "14";
    case "parts-rims-inches-15":
      return "15";
    case "parts-rims-inches-16":
      return "16";
    case "parts-rims-inches-17":
      return "17";
    case "parts-rims-inches-18":
      return "18";
    case "parts-rims-inches-19":
      return "19";
    case "parts-rims-inches-20":
      return "20";
    case "parts-rims-inches-21":
      return "21";
    case "parts-rims-inches-22":
      return "22";
    default:
      return undefined;
  }
}

function SliderControls() {
  const swiper = useSwiper();

  return (
    <>
      <button
        type="button"
        className="wheel-ad-card__slider-button wheel-ad-card__slider-button--prev"
        onClick={() => swiper.slidePrev()}
        aria-label="Imaginea anterioară"
      >
        <ChevronLeft size={19} strokeWidth={2} />
      </button>

      <button
        type="button"
        className="wheel-ad-card__slider-button wheel-ad-card__slider-button--next"
        onClick={() => swiper.slideNext()}
        aria-label="Imaginea următoare"
      >
        <ChevronRight size={19} strokeWidth={2} />
      </button>
    </>
  );
}

export default function WheelAdvertCard({
  advert,
  href = advert.url,
  priority = false,
  cityName = "Pitești, Argeș",
}: WheelAdvertCardProps) {
  const wheelType = getWheelType(advert);
  const rimSize = getRimSize(advert);

  return (
    <article className="wheel-ad-card">
      <div className="wheel-ad-card__media">
        {advert.images.length > 0 ? (
          <Swiper
            modules={[Pagination, A11y]}
            slidesPerView={1}
            speed={300}
            pagination={{
              clickable: true,
            }}
            a11y={{
              enabled: true,
              prevSlideMessage: "Imaginea anterioară",
              nextSlideMessage: "Imaginea următoare",
              itemRoleDescriptionMessage: "Imagine",
            }}
            className="wheel-ad-card__swiper"
          >
            <SliderControls />

            {advert.images.map((image, index) => (
              <SwiperSlide key={image.id ?? `${image.url}-${index}`}>
                <Link
                  href={`/anunturi/jante-si-roti/${advert.id}`}
                  className="wheel-ad-card__image-link"
                  aria-label={`Vezi anunțul: ${advert.title}`}
                >
                  <div className="wheel-ad-card__image-wrapper">
                    <Image
                      src={image.url}
                      alt={`${advert.title} - imagine ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className="wheel-ad-card__image"
                      priority={priority && index === 0}
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="wheel-ad-card__image-placeholder">
            <Images size={40} strokeWidth={1.5} />
            <span>Fără imagini</span>
          </div>
        )}

        {advert.images.length > 1 && (
          <div className="wheel-ad-card__image-count">
            <Images size={13} strokeWidth={2} />
            <span>{advert.images.length}</span>
          </div>
        )}

        <span className="wheel-ad-card__condition">Second-hand</span>
      </div>

      <div className="wheel-ad-card__content">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="wheel-ad-card__main-link"
        >
          <div className="wheel-ad-card__eyebrow">JANTE · SECOND-HAND</div>

          <h2 className="wheel-ad-card__title">{advert.title}</h2>

          <div className="wheel-ad-card__specs">
            {rimSize && (
              <div className="wheel-ad-card__spec">
                <span className="wheel-ad-card__spec-value">{rimSize}"</span>

                <span className="wheel-ad-card__spec-label">Diametru</span>
              </div>
            )}

            <div className="wheel-ad-card__spec">
              <span className="wheel-ad-card__spec-value">{wheelType}</span>

              <span className="wheel-ad-card__spec-label">Material</span>
            </div>

            {advert.images.length > 0 && (
              <div className="wheel-ad-card__spec">
                <span className="wheel-ad-card__spec-value">
                  {advert.images.length}
                </span>

                <span className="wheel-ad-card__spec-label">Imagini</span>
              </div>
            )}
          </div>

          <div className="wheel-ad-card__meta">
            <span className="wheel-ad-card__location">
              <MapPin size={14} strokeWidth={2} aria-hidden="true" />

              {cityName}
            </span>

            {advert.price.negotiable && (
              <span className="wheel-ad-card__negotiable">Negociabil</span>
            )}
          </div>

          <div className="wheel-ad-card__price">
            {advert.price.value.toLocaleString("ro-RO", {
              maximumFractionDigits: 2,
            })}

            <span className="wheel-ad-card__currency">
              {" "}
              {advert.price.currency}
            </span>
          </div>
        </a>

        <Link
          href={`/anunturi/jante-si-roti/${advert.id}`}
          className="wheel-ad-card__cta"
        >
          Vezi anunțul
        </Link>
      </div>
    </article>
  );
}
