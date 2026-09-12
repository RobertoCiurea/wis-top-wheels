"use client";
import { useEffect, useCallback, useActionState } from "react";
import Image from "next/image";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { ActionState } from "../types/types";
import { deleteAdvert } from "../actions/deleteAdvert";
import { advertAction } from "../actions/advertAction";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Images,
  MapPin,
  MessageCircle,
  Phone,
  Store,
  UserRound,
} from "lucide-react";
import { WheelAdProps } from "../types/types";
import { Modal } from "./Modal";
import { useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "@/app/styles/wheel-advert.css";

//service functions
import { getAttribute } from "@/services/advertService";
import { getWheelType } from "@/services/advertService";
import { getState } from "@/services/advertService";
import { getRimSize } from "@/services/advertService";
import { formatSeason } from "@/services/advertService";
import { formatTyreWidth } from "@/services/advertService";
import { formatTyreInches } from "@/services/advertService";
import { formatTyresProfile } from "@/services/advertService";
import { formatDate } from "@/services/advertService";
import { formatPrice } from "@/services/advertService";
import { getLocationName } from "@/services/advertService";
import { formatCategoryId } from "@/services/advertService";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
type WheelSpecification = {
  label: string;
  value: string;
};

function getWheelSpecifications(advert: WheelAdProps): WheelSpecification[] {
  const specifications: WheelSpecification[] = [];
  const wheelMaterial = getWheelType(advert);
  const wheelState = getState(advert);
  const rimBrand = getAttribute(
    advert,

    "donor_make",
  );
  const rimMaterial = getAttribute(advert, "rim_material");
  const tyreBrand = getAttribute(
    advert,

    "tire_brand",
  );
  const tyreSeason = getAttribute(
    advert,

    "tyres_type",
  );
  const tyreWidth = getAttribute(advert, "tyres_width");
  const tyreProfile = getAttribute(
    advert,

    "tyres_profile",
  );

  const tyreInches = getAttribute(advert, "tyres_inches");

  if (wheelState) {
    specifications.push({ label: "Stare", value: wheelState });
  }
  if (getRimSize(advert))
    specifications.push({
      label: "Diametru",
      value: `${getRimSize(advert)}\"`,
    });

  if (wheelMaterial)
    specifications.push({ label: "Material", value: wheelMaterial });
  if (rimBrand)
    specifications.push({
      label: "Marcă jantă",
      value: rimBrand.charAt(0).toUpperCase() + rimBrand.slice(1),
    });
  if (rimMaterial && !wheelMaterial)
    specifications.push({ label: "Material", value: rimMaterial });
  if (tyreBrand)
    specifications.push({
      label: "Marcă anvelopă",
      value: tyreBrand.charAt(0).toUpperCase() + tyreBrand.slice(1),
    });
  if (tyreSeason)
    specifications.push({ label: "Sezon", value: formatSeason(tyreSeason) });
  if (tyreWidth)
    specifications.push({
      label: "Lățime",
      value: `${formatTyreWidth(tyreWidth)} mm`,
    });
  if (tyreProfile)
    specifications.push({
      label: "Profil",
      value: `${formatTyresProfile(tyreProfile)} mm`,
    });
  if (tyreInches) {
    specifications.push({
      label: "Dimensiune anvelope",
      value: `${formatTyreInches(tyreInches)} '`,
    });
  }

  return specifications;
}

function GalleryControls() {
  const swiper = useSwiper();

  return (
    <div
      className="wheel-advert__gallery-controls"
      aria-label="Navigare imagini"
    >
      <button
        type="button"
        onClick={() => swiper.slidePrev()}
        aria-label="Imaginea anterioară"
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => swiper.slideNext()}
        aria-label="Imaginea următoare"
      >
        <ChevronRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}

export const WheelAdvert = ({ advert }: { advert: WheelAdProps }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const specifications = getWheelSpecifications(advert);
  const publishedDate = formatDate(advert.activated_at || advert.created_at);
  const price = formatPrice(advert);
  const imageUrls = advert.images.filter((image) => image.url.trim());
  const title = advert.title.trim() || "Anunț jante și roți";
  const sellerName = advert.contact.name.trim();
  const hasLocation = advert.location.city_id > 0;
  const locationName = getLocationName(advert.location.city_id);
  const phoneNumber = advert.contact.phone.trim();
  const whatsappNumber = phoneNumber.replace(/\D/g, "");
  const latitude = Number.parseFloat(advert.location.latitude);
  const longitude = Number.parseFloat(advert.location.longitude);
  const googleMapsUrl =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : undefined;

  const session = useSession();
  const initialDeleteState: ActionState = {
    status: 0,
    message: "",
    error: "",
  };
  const initialActionState: ActionState = {
    status: 0,
    message: "",
    error: "",
  };

  const [deleteState, deleteAction, deleteIsPending] = useActionState(
    deleteAdvert,
    initialDeleteState,
  );
  const [actionState, formAction, actionIsPending] = useActionState(
    advertAction,
    initialActionState,
  );

  enum AdvertAction {
    ACTIVATE = "activate",
    DEACTIVATE = "deactivate",
    FINISH = "finish",
    EXTEND = "extend",
  }
  const [isOpen, setIsOpen] = useState(false);
  const [advertActionState, setAdvertActionState] = useState<AdvertAction>(
    AdvertAction.ACTIVATE,
  );

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (deleteState.status !== 0) {
      if (deleteState.status === 200)
        toast.success(deleteState.message || "Anunțul a fost șters cu succes!");
      else toast.error(deleteState.error || "Eroare la ștergerea anunțului");
    }
  }, [deleteState]);

  useEffect(() => {
    if (actionState.status !== 0) {
      if (actionState.status === 200)
        toast.success(
          actionState.message || "Anunțul a fost modificat cu succes!",
        );
      else
        toast.error(
          actionState.error || "Eroare la actualizarea statusului anunțului",
        );
    }
  }, [actionState]);

  return (
    <>
      <article className="wheel-advert" aria-labelledby="wheel-advert-title">
        <div className="wheel-advert__gallery-container">
          <div className="wheel-advert__gallery">
            {imageUrls.length > 0 ? (
              <Swiper
                modules={[A11y, Pagination]}
                pagination={{ clickable: true }}
                slidesPerView={1}
                className="wheel-advert__swiper"
                a11y={{
                  enabled: true,
                  prevSlideMessage: "Imaginea anterioară",
                  nextSlideMessage: "Imaginea următoare",
                  itemRoleDescriptionMessage: "Imagine produs",
                }}
              >
                {imageUrls.length > 1 && <GalleryControls />}
                {imageUrls.map((image, index) => (
                  <SwiperSlide key={image.id ?? `${image.url}-${index}`}>
                    <button
                      type="button"
                      className="wheel-advert__image-button"
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Mărește imaginea ${index + 1} din ${imageUrls.length}`}
                    >
                      <div className="wheel-advert__image-frame">
                        <Image
                          src={image.url}
                          alt={`${title} - imaginea ${index + 1}`}
                          fill
                          sizes="(max-width: 900px) 100vw, 1280px"
                          className="wheel-advert__image"
                          priority={index === 0}
                        />
                      </div>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div
                className="wheel-advert__placeholder"
                role="img"
                aria-label="Imagine indisponibilă"
              >
                <Images size={48} strokeWidth={1.4} aria-hidden="true" />
                <span>Imagine indisponibilă</span>
              </div>
            )}
            {imageUrls.length > 1 && (
              <span className="wheel-advert__image-count">
                <Images size={15} aria-hidden="true" />
                {imageUrls.length} imagini
              </span>
            )}
          </div>
        </div>

        <div className="wheel-advert__content">
          <div className="wheel-advert__eyebrow">
            {formatCategoryId(advert.category_id)}
          </div>
          {session.status == "authenticated" && (
            <div
              className="wheel-advert__eyebrow"
              style={{ color: "var(--gray)", fontSize: "11px" }}
            >
              STATUS {advert.status}
            </div>
          )}
          <h1 id="wheel-advert-title" className="wheel-advert__title">
            {title}
          </h1>

          <div className="wheel-advert__price-row">
            {price ? (
              <p className="wheel-advert__price">{price}</p>
            ) : (
              <p className="wheel-advert__price wheel-advert__price--missing">
                Preț la cerere
              </p>
            )}
            {advert.price.negotiable && (
              <span className="wheel-advert__badge">Negociabil</span>
            )}
          </div>

          {specifications.length > 0 && (
            <section
              className="wheel-advert__section"
              aria-labelledby="wheel-specifications-title"
            >
              <h2
                id="wheel-specifications-title"
                className="wheel-advert__section-title"
              >
                Specificații
              </h2>
              <ul className="wheel-advert__specs">
                {specifications.map((specification) => (
                  <li key={`${specification.label}-${specification.value}`}>
                    <strong>{specification.value}</strong>
                    <span>{specification.label}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <dl className="wheel-advert__details">
            {hasLocation && (
              <div>
                <dt>
                  <MapPin size={17} aria-hidden="true" />
                  Locație
                </dt>
                <dd>
                  {googleMapsUrl ? (
                    <a
                      className="wheel-advert__map-link"
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locationName ? locationName : "Vezi pe Google Maps"}
                    </a>
                  ) : (
                    "Locație disponibilă"
                  )}
                </dd>
              </div>
            )}
            <div>
              <dt>
                {advert.advertiser_type === "business" ? (
                  <Store size={17} aria-hidden="true" />
                ) : (
                  <UserRound size={17} aria-hidden="true" />
                )}
                Vânzător
              </dt>
              <dd>
                {advert.advertiser_type === "business"
                  ? "Firmă"
                  : advert.advertiser_type === "private"
                    ? "Persoană fizică"
                    : "Vânzător"}
                {sellerName ? ` · ${sellerName}` : ""}
              </dd>
            </div>
            {publishedDate && (
              <div>
                <dt>
                  <CalendarDays size={17} aria-hidden="true" />
                  Publicat
                </dt>
                <dd>
                  <time dateTime={advert.activated_at || advert.created_at}>
                    {publishedDate}
                  </time>
                </dd>
              </div>
            )}
          </dl>

          {advert.description.trim() && (
            <section
              className="wheel-advert__description"
              aria-labelledby="wheel-description-title"
            >
              <h2
                id="wheel-description-title"
                className="wheel-advert__section-title"
              >
                Descriere
              </h2>
              <p>{advert.description.trim()}</p>
            </section>
          )}

          <div className="wheel-advert__actions">
            {phoneNumber && (
              <a
                className="wheel-advert__action wheel-advert__action--call"
                href={`tel:${phoneNumber}`}
              >
                <Phone size={17} aria-hidden="true" />
                Sună
              </a>
            )}
            {whatsappNumber && (
              <a
                className="wheel-advert__action wheel-advert__action--message"
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Mesaj
              </a>
            )}
            {advert.url.trim() && (
              <a
                className="wheel-advert__cta"
                href={advert.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Vezi anunțul pe OLX
                <ExternalLink size={18} aria-hidden="true" />
              </a>
            )}
          </div>
          {session.status === "authenticated" && (
            <div className="admin-action-buttons">
              <div className="top">
                <button type="button" className="advert-card-button update">
                  <a
                    href={`https://www.olx.ro/d/adding/edit/${advert.id}/?bs=olx_pro_listing`}
                    title="Editează anunțul"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Editează
                  </a>
                </button>
                <button
                  type="button"
                  className="advert-card-button action"
                  onClick={openModal}
                >
                  Acțiune
                </button>
              </div>
              <div className="bottom">
                <form action={deleteAction}>
                  <input
                    type="hidden"
                    name="advert-id"
                    defaultValue={advert.id}
                  />
                  <button
                    type="submit"
                    disabled={deleteIsPending}
                    className="advert-card-button delete"
                  >
                    {deleteIsPending ? "Se șterge..." : "Șterge"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
          title="Imagine produs"
          maxWidth="1200px"
        >
          {selectedImageIndex !== null && imageUrls[selectedImageIndex] && (
            <div className="wheel-advert__lightbox">
              <div className="wheel-advert__lightbox-image">
                <Image
                  src={imageUrls[selectedImageIndex].url}
                  alt={`${title} - imagine mărită`}
                  fill
                  sizes="90vw"
                  className="wheel-advert__lightbox-photo"
                />
              </div>
            </div>
          )}
        </Modal>
      </article>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Alege o acțiune pentru anunț"
        footer={
          <button
            type="submit"
            form="advert-action-form"
            className="modal-action-button primary"
            disabled={actionIsPending}
          >
            {actionIsPending ? "Se încarcă..." : "Aplică acțiunea"}
          </button>
        }
      >
        <form action={formAction} id="advert-action-form">
          <input type="hidden" name="advert-id" defaultValue={advert.id} />
          <select
            name="advert-action"
            defaultValue={advertActionState}
            className="form-input"
          >
            <option
              value={AdvertAction.ACTIVATE}
              onClick={() => setAdvertActionState(AdvertAction.ACTIVATE)}
            >
              Activează
            </option>
            <option
              value={AdvertAction.DEACTIVATE}
              onClick={() => setAdvertActionState(AdvertAction.DEACTIVATE)}
            >
              Dezactivează
            </option>
            <option
              value={AdvertAction.FINISH}
              onClick={() => setAdvertActionState(AdvertAction.FINISH)}
            >
              Finish
            </option>
            <option
              value={AdvertAction.EXTEND}
              onClick={() => setAdvertActionState(AdvertAction.EXTEND)}
            >
              Extinde
            </option>
          </select>
        </form>
      </Modal>
    </>
  );
};
