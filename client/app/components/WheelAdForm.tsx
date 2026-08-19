"use client";

import {
  ChangeEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { createWheelAd } from "@/app/actions/createWheelAdAction";
import "@/app/styles/contact.css";
import "@/app/styles/wheel-ad-form.css";
import { WheelAdFormActionState } from "../types/types";
import { uploadFilesToSTorage } from "@/services/uploadService";

const AD_TYPES = [
  { value: "RIMS_ONLY", label: "Doar jante" },
  { value: "TYRES_ONLY", label: "Doar cauciucuri" },
  { value: "FULL_WHEELS", label: "Set roți complete" },
] as const;

const STATES = [
  { value: "new", label: "Nou" },
  { value: "used", label: "Second hand" },
] as const;

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

const RIM_DIAMETERS = [
  { value: "12", label: "12 inch și sub" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "16.5", label: "16,5" },
  { value: "17", label: "17" },
  { value: "17.5", label: "17,5" },
  { value: "18", label: "18" },
  { value: "19.5", label: "19,5" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22 inch și peste" },
] as const;

const RIM_MATERIALS = [
  { value: "Aliaj", label: "Aliaj" },
  { value: "Otel", label: "Otel" },
] as const;

const TYRE_SEASONS = [
  { value: "iarna", label: "Iarnă" },
  { value: "vara", label: "Vară" },
  { value: "all_season", label: "All Season" },
] as const;

const TYRE_WIDTHS = Array.from(
  { length: (355 - 125) / 10 + 1 },
  (_, index) => 125 + index * 10,
);
const TYRE_PROFILES = [
  7,
  9.5,
  10.5,
  11.5,
  12.5,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
  60,
  65,
  70,
  75,
  80,
  85,
  "Altele",
] as const;

const toNormalizedValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const brandOptions = (items: string[]) =>
  items.map((label) => ({ value: toNormalizedValue(label), label }));

const rimBrandOptions = brandOptions(RIM_BRANDS);
const tyreBrandOptions = brandOptions(TYRE_BRANDS);

const initialState: WheelAdFormActionState = {
  success: false,
  message: "",
  errors: {},
  formError: "",
};

export const WheelAdForm = () => {
  const [selectedWheelType, setSelectedWheelType] =
    useState<(typeof AD_TYPES)[number]["value"]>("RIMS_ONLY");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [state, formAction, isPending] = useActionState(
    createWheelAd,
    initialState,
  );

  const visibleErrors = state.errors ?? {};

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type),
    );

    if (validFiles.length > 10) {
      setImageUploadError("Poți atașa doar 10 imagini.");
    }
    if (validFiles.length !== files.length) {
      setImageUploadError("Doar fișiere JPG și PNG sunt acceptate.");
    } else {
      setImageUploadError("");
    }

    const newFiles = validFiles.slice(0, 10);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((current) => [...current, ...newFiles].slice(0, 10));
    setImagePreviews((current) => [...current, ...newPreviews].slice(0, 10));

    if (event.target) {
      event.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedFiles((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );
    setImagePreviews((current) => {
      const previewToRemove = current[indexToRemove];
      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove);
      }
      return current.filter((_, index) => index !== indexToRemove);
    });
  };

  const isFieldInvalid = (fieldName: string) =>
    Boolean(visibleErrors[fieldName]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    setIsUploading(true);
    setImageUploadError("");
    const formData = new FormData(e.currentTarget);
    formData.delete("images");
    try {
      const uploadedUrls = await uploadFilesToSTorage(selectedFiles);
      formData.set("imageUrls", JSON.stringify(uploadedUrls));
      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      console.error("Storage network error:", error);
      setImageUploadError(
        "A apărut o eroare la transferul direct al imaginilor. Vă rugăm să verificați conexiunea.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="wheel-ad-form-shell">
      <div className="wheel-ad-form-header">
        <div>
          <h1 className="display d3">Adaugă anunț nou</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="wheel-ad-form contact-form"
        noValidate
      >
        {state.formError && (
          <div className="form-error global-error">{state.formError}</div>
        )}
        {imageUploadError && (
          <div className="form-error global-error">{imageUploadError}</div>
        )}
        {state.success && state.message && (
          <div className="form-success global-success">{state.message}</div>
        )}

        <input type="hidden" name="imageUrls" value="[]" />

        <div className="form-section">
          <div className="section-heading">
            <h2>Informații generale</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="wheelType" className="form-label">
                Tip anunț
              </label>
              <select
                id="wheelType"
                name="wheelType"
                className={`form-input ${isFieldInvalid("wheelType") ? "form-input-error" : ""}`}
                defaultValue={selectedWheelType}
                aria-invalid={isFieldInvalid("wheelType")}
                aria-describedby={
                  isFieldInvalid("wheelType") ? "wheelType-error" : undefined
                }
                onChange={(event) =>
                  setSelectedWheelType(
                    event.target.value as typeof selectedWheelType,
                  )
                }
              >
                {AD_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isFieldInvalid("wheelType") && (
                <div id="wheelType-error" className="form-error">
                  {visibleErrors.wheelType}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">
                Stare
              </label>
              <select
                id="state"
                name="state"
                className={`form-input ${isFieldInvalid("state") ? "form-input-error" : ""}`}
                defaultValue="used"
                aria-invalid={isFieldInvalid("state")}
                aria-describedby={
                  isFieldInvalid("state") ? "state-error" : undefined
                }
              >
                {STATES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isFieldInvalid("state") && (
                <div id="state-error" className="form-error">
                  {visibleErrors.state}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Jante</h2>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="rimMake" className="form-label">
                Marcă
              </label>
              <select
                id="rimMake"
                name="rimMake"
                className={`form-input ${isFieldInvalid("rimMake") ? "form-input-error" : ""}`}
                defaultValue=""
                aria-invalid={isFieldInvalid("rimMake")}
                aria-describedby={
                  isFieldInvalid("rimMake") ? "rimMake-error" : undefined
                }
              >
                <option value="">Selectează o marcă</option>
                {rimBrandOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isFieldInvalid("rimMake") && (
                <div id="rimMake-error" className="form-error">
                  {visibleErrors.rimMake}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rimDiameter" className="form-label">
                Diametru
              </label>
              <select
                id="rimDiameter"
                name="rimDiameter"
                className={`form-input ${isFieldInvalid("rimDiameter") ? "form-input-error" : ""}`}
                defaultValue=""
                aria-invalid={isFieldInvalid("rimDiameter")}
                aria-describedby={
                  isFieldInvalid("rimDiameter")
                    ? "rimDiameter-error"
                    : undefined
                }
              >
                <option value="">Selectează diametrul</option>
                {RIM_DIAMETERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isFieldInvalid("rimDiameter") && (
                <div id="rimDiameter-error" className="form-error">
                  {visibleErrors.rimDiameter}
                </div>
              )}
            </div>

            {selectedWheelType !== "TYRES_ONLY" && (
              <div className="form-group">
                <label htmlFor="rimMaterial" className="form-label">
                  Material
                </label>
                <select
                  id="rimMaterial"
                  name="rimMaterial"
                  className={`form-input ${isFieldInvalid("rimMaterial") ? "form-input-error" : ""}`}
                  defaultValue=""
                  aria-invalid={isFieldInvalid("rimMaterial")}
                  aria-describedby={
                    isFieldInvalid("rimMaterial")
                      ? "rimMaterial-error"
                      : undefined
                  }
                >
                  <option value="">Selectează materialul</option>
                  {RIM_MATERIALS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isFieldInvalid("rimMaterial") && (
                  <div id="rimMaterial-error" className="form-error">
                    {visibleErrors.rimMaterial}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {selectedWheelType !== "RIMS_ONLY" && (
          <div className="form-section">
            <div className="section-heading">
              <h2>Anvelope</h2>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="tyreMake" className="form-label">
                  Marca anvelope
                </label>
                <select
                  id="tyreMake"
                  name="tyreMake"
                  className={`form-input ${isFieldInvalid("tyreMake") ? "form-input-error" : ""}`}
                  defaultValue=""
                  aria-invalid={isFieldInvalid("tyreMake")}
                  aria-describedby={
                    isFieldInvalid("tyreMake") ? "tyreMake-error" : undefined
                  }
                >
                  <option value="">Selectează marca</option>
                  {tyreBrandOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isFieldInvalid("tyreMake") && (
                  <div id="tyreMake-error" className="form-error">
                    {visibleErrors.tyreMake}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tyreSeason" className="form-label">
                  Sezon
                </label>
                <select
                  id="tyreSeason"
                  name="tyreSeason"
                  className={`form-input ${isFieldInvalid("tyreSeason") ? "form-input-error" : ""}`}
                  defaultValue=""
                  aria-invalid={isFieldInvalid("tyreSeason")}
                  aria-describedby={
                    isFieldInvalid("tyreSeason")
                      ? "tyreSeason-error"
                      : undefined
                  }
                >
                  <option value="">Selectează sezonul</option>
                  {TYRE_SEASONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isFieldInvalid("tyreSeason") && (
                  <div id="tyreSeason-error" className="form-error">
                    {visibleErrors.tyreSeason}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tyreWidth" className="form-label">
                  Lățime
                </label>
                <select
                  id="tyreWidth"
                  name="tyreWidth"
                  className={`form-input ${isFieldInvalid("tyreWidth") ? "form-input-error" : ""}`}
                  defaultValue=""
                  aria-invalid={isFieldInvalid("tyreWidth")}
                  aria-describedby={
                    isFieldInvalid("tyreWidth") ? "tyreWidth-error" : undefined
                  }
                >
                  <option value="">Selectează lățimea</option>
                  {TYRE_WIDTHS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {isFieldInvalid("tyreWidth") && (
                  <div id="tyreWidth-error" className="form-error">
                    {visibleErrors.tyreWidth}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tyreProfile" className="form-label">
                  Profil
                </label>
                <select
                  id="tyreProfile"
                  name="tyreProfile"
                  className={`form-input ${isFieldInvalid("tyreProfile") ? "form-input-error" : ""}`}
                  defaultValue=""
                  aria-invalid={isFieldInvalid("tyreProfile")}
                  aria-describedby={
                    isFieldInvalid("tyreProfile")
                      ? "tyreProfile-error"
                      : undefined
                  }
                >
                  <option value="">Selectează profilul</option>
                  {TYRE_PROFILES.map((option) => (
                    <option key={String(option)} value={String(option)}>
                      {option}
                    </option>
                  ))}
                </select>
                {isFieldInvalid("tyreProfile") && (
                  <div id="tyreProfile-error" className="form-error">
                    {visibleErrors.tyreProfile}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="section-heading">
            <h2>Descriere și preț</h2>
          </div>
          <div className="form-grid single-column">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Titlu
              </label>
              <input
                id="title"
                name="title"
                type="text"
                minLength={16}
                maxLength={150}
                required
                className={`form-input ${isFieldInvalid("title") ? "form-input-error" : ""}`}
                aria-invalid={isFieldInvalid("title")}
                aria-describedby={
                  isFieldInvalid("title") ? "title-error" : undefined
                }
              />
              {isFieldInvalid("title") && (
                <div id="title-error" className="form-error">
                  {visibleErrors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descriere
              </label>
              <textarea
                id="description"
                name="description"
                minLength={40}
                maxLength={9000}
                required
                rows={7}
                className={`form-input ${isFieldInvalid("description") ? "form-input-error" : ""}`}
                aria-invalid={isFieldInvalid("description")}
                aria-describedby={
                  isFieldInvalid("description")
                    ? "description-error"
                    : undefined
                }
              />
              {isFieldInvalid("description") && (
                <div id="description-error" className="form-error">
                  {visibleErrors.description}
                </div>
              )}
            </div>

            <div className="form-group form-group-price">
              <label htmlFor="price" className="form-label">
                Preț
              </label>
              <div className="price-field-wrap">
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className={`form-input ${isFieldInvalid("price") ? "form-input-error" : ""}`}
                  aria-invalid={isFieldInvalid("price")}
                  aria-describedby={
                    isFieldInvalid("price") ? "price-error" : undefined
                  }
                />
                <span className="currency-label">RON</span>
              </div>
              {isFieldInvalid("price") && (
                <div id="price-error" className="form-error">
                  {visibleErrors.price}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-heading">
            <h2>Imagini</h2>
          </div>

          <div className="image-upload-wrap">
            <input
              ref={fileInputRef}
              id="images"
              type="file"
              name="images"
              accept="image/jpeg,image/png"
              multiple
              className="image-upload-input"
              onChange={handleFileChange}
            />
            <label htmlFor="images" className="image-upload-area">
              <span className="image-upload-title">Alege fotografii</span>
              <span className="image-upload-subtitle">
                JPG / PNG · maxim 10 imagini
              </span>
            </label>
            {imagePreviews.length > 0 && (
              <div className="image-preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={`${preview}-${index}`}
                    className="image-preview-item"
                  >
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="image-remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="wheel-ad-form-actions">
          <button
            type="submit"
            className="btn btn-gold btn-lg"
            disabled={isPending || isUploading}
          >
            {isUploading
              ? "Se transferă datele"
              : isPending
                ? "Se publică..."
                : "Publică anunț"}
          </button>
        </div>
      </form>
    </section>
  );
};
