"use client";
import { useActionState, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, MapPin } from "lucide-react";
import Link from "next/link";
import { A11y, Pagination } from "swiper/modules";

//actions
import { deleteAdvert } from "../actions/deleteAdvert";
import { advertAction } from "../actions/advertAction";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Modal } from "./Modal";
import "swiper/css";
import "swiper/css/pagination";
import { WheelAdProps } from "../types/types";
import { ActionState } from "../types/types";
import "@/app/styles/wheel-ad-card.css";
import "@/app/styles/contact.css";

//advert service functions
import {
  formatDate,
  formatSeason,
  formatTyreInches,
  formatTyresProfile,
  formatTyreWidth,
  getAttribute,
  getState,
  getWheelType,
} from "@/services/advertService";
import { getRimSize } from "@/services/advertService";
import { formatCategoryId } from "@/services/advertService";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
interface WheelAdvertCardProps {
  advert: WheelAdProps;

  href?: string;

  priority?: boolean;

  cityName?: string | "Pitesti";
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

export const WheelAdvertCard = ({
  advert,
  href = advert.url,
  priority = false,
  cityName = "Pitești, Argeș",
}: WheelAdvertCardProps) => {
  const session = useSession();
  const wheelType = getWheelType(advert);
  const rimSize = getRimSize(advert);
  const tyreBrand = getAttribute(advert, "tire_brand");
  const tyreSeason = getAttribute(advert, "tyres_type");
  const tyreInches = getAttribute(advert, "tyres_inches");
  const tyreWidth = getAttribute(advert, "tyres_width");
  const tyreProfile = getAttribute(advert, "tyres_profile");
  const rimBrand = getAttribute(advert, "donor_make");

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
      <article className="wheel-ad-card">
        {session.status === "authenticated" && (
          <div className="wheel-ad-card__status">
            <span>STATUS</span>
            <span className={`${advert.status === "active" ? "active" : ""}`}>
              {advert.status}
            </span>
          </div>
        )}
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
                        loading="eager"
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

          <span className="wheel-ad-card__condition">{getState(advert)}</span>
        </div>

        <div className="wheel-ad-card__content">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="wheel-ad-card__main-link"
          >
            <div className="wheel-ad-card__eyebrow">
              {formatCategoryId(advert.category_id)}
            </div>

            <h2 className="wheel-ad-card__title">{advert.title}</h2>

            <div className="wheel-ad-card__specs">
              {advert.category_id === 1649 ? (
                <>
                  {tyreBrand !== undefined && (
                    <div className="wheel-ad-card__spec">
                      <span className="wheel-ad-card__spec-value">
                        {tyreBrand.charAt(0).toUpperCase() + tyreBrand.slice(1)}
                      </span>
                      <span className="wheel-ad-card__spec-label">
                        Brand cauciucuri
                      </span>
                    </div>
                  )}
                  {tyreSeason !== undefined && (
                    <div className="wheel-ad-card__spec">
                      <span className="wheel-ad-card__spec-value">
                        {formatSeason(tyreSeason)}
                      </span>
                      <span className="wheel-ad-card__spec-label">
                        Tip cauciuc
                      </span>
                    </div>
                  )}
                  {tyreWidth !== undefined &&
                    tyreProfile !== undefined &&
                    tyreInches !== undefined && (
                      <div className="wheel-ad-card__spec">
                        <span className="wheel-ad-card__spec-value">
                          {`${formatTyreWidth(tyreWidth)} / ${formatTyresProfile(tyreProfile)} / R${formatTyreInches(tyreInches)}`}
                        </span>
                        <span className="wheel-ad-card__spec-label">
                          Dimensiuni
                        </span>
                      </div>
                    )}
                </>
              ) : (
                <>
                  {wheelType !== undefined && (
                    <div className="wheel-ad-card__spec">
                      <span className="wheel-ad-card__spec-value">
                        {wheelType}
                      </span>
                      <span className="wheel-ad-card__spec-label">
                        Material jante
                      </span>
                    </div>
                  )}
                  {rimSize !== undefined && (
                    <div className="wheel-ad-card__spec">
                      <span className="wheel-ad-card__spec-value">
                        {rimSize} inch
                      </span>
                      <span className="wheel-ad-card__spec-label">
                        Diametru
                      </span>
                    </div>
                  )}
                  {rimBrand !== undefined ? (
                    <div className="wheel-ad-card__spec">
                      <span className="wheel-ad-card__spec-value">
                        {rimBrand.charAt(0).toUpperCase() + rimBrand.slice(1)}
                      </span>
                      <span className="wheel-ad-card__spec-label">
                        Brand jante
                      </span>
                    </div>
                  ) : (
                    advert.images.length > 1 && (
                      <div className="wheel-ad-card__spec">
                        <span className="wheel-ad-card__spec-value">
                          {advert.images.length}
                        </span>
                        <span className="wheel-ad-card__spec-label">
                          Imagini
                        </span>
                      </div>
                    )
                  )}
                </>
              )}
            </div>

            <div className="wheel-ad-card__meta">
              <span className="wheel-ad-card__location">
                <MapPin size={14} strokeWidth={2} aria-hidden="true" />

                {cityName}
              </span>

              <div className="wheel-ad-card__date">
                {formatDate(advert.created_at)}
              </div>

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
