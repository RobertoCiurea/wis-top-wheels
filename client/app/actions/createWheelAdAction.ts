"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { WheelAdFormActionState } from "../types/types";
import { auth } from "@/auth";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

const baseAdSchema = z.object({
  title: z
    .string()
    .min(16, "Titlul trebuie să aibă minim 16 caractere. ")
    .max(150, "Titlul nu poate depăși 150 de caractere"),
  description: z
    .string()
    .min(40, "Descrierea trebuie să aibă minim 40 de caractere.")
    .max(9000, "Descrierea nu poate depăși 9000 de caractere."),
  price: z.coerce
    .number()
    .positive("Prețul este obligatoriu și trebuie să fie strict pozitiv.")
    .transform((val) => Number(val.toFixed(2))),
  state: z.enum(["new", "used"], {
    error: "Starea produsului este obligatorie.",
  }),
  imageUrls: z.string().transform((str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed)
        ? parsed.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  }),
});

const wheelAdSchema = z.discriminatedUnion("wheelType", [
  baseAdSchema.extend({
    wheelType: z.literal("RIMS_ONLY"),
    rimMake: z
      .string()
      .min(1, "Marca jantei este obligatorie")
      .transform(slugify),
    rimDiameter: z.coerce.number().min(1, "Diametrul jantei este obligatoriu."),
    rimMaterial: z.string().min(1, "Materialul jantei este obligatoriu."),
  }),
  baseAdSchema.extend({
    wheelType: z.literal("TYRES_ONLY"),
    rimMake: z
      .string()
      .min(1, "Marca compatibilă este obligatorie.")
      .transform(slugify),
    rimDiameter: z.coerce.number().min(1, "Diametrul este obligatoriu."),
    tyreMake: z
      .string()
      .min(1, "Marca anvelopei este obligatorie.")
      .transform(slugify),
    tyreSeason: z
      .string()
      .min(1, "Sezonul anvelopei este obligatoriu.")
      .transform((val) => val.toLowerCase()),
    tyreWidth: z.coerce.number().min(1, "Lățimea anvelopei este obligatorie."),
    tyreProfile: z.coerce
      .number()
      .min(1, "Profilul anvelopei este obligatoriu."),
  }),
  baseAdSchema.extend({
    wheelType: z.literal("FULL_WHEEL"),
    rimMake: z
      .string()
      .min(1, "Marca jantei este obligatorie.")
      .transform(slugify),
    rimDiameter: z.coerce.number().min(1, "Diametrul jantei este obligatoriu."),
    rimMaterial: z.string().min(1, "Materialul jantei este obligatoriu."),
    tyreMake: z
      .string()
      .min(1, "Marca anvelopei este obligatorie.")
      .transform(slugify),
    tyreSeason: z
      .string()
      .min(1, "Sezonul anvelopei este obligatoriu.")
      .transform((val) => val.toLowerCase()),
    tyreWidth: z.coerce.number().min(1, "Lățimea anvelopei este obligatorie."),
    tyreProfile: z.coerce
      .number()
      .min(1, "Profilul anvelopei este obligatoriu."),
  }),
]);

export async function createWheelAd(
  prevState: WheelAdFormActionState,
  formData: FormData,
): Promise<WheelAdFormActionState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      success: false,
      errors: { Unauthorized: "You are not authorized to post an ad" },
      formError:
        "Acces neautorizat. Vă rugăm să vă autentificați pentru a publica un anunț.",
    };
  }

  const accessToken = session.accessToken;
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = wheelAdSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errors: Record<string, string> = {};
    validatedFields.error.issues.forEach((issue) => {
      const fieldName = issue.path[0].toString();
      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
    return {
      success: false,
      errors,
      formError: "Verificați câmpurile marcate și încercați din nou.",
    };
  }

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

    //quick fix for development. Change this is production (when moving from ngrok port)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const response = await fetch(`${apiBaseUrl}/api/ad/wheels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      console.log(errorPayload);
      return {
        success: false,
        formError:
          errorPayload?.message ||
          "A apărut o eroare la publicarea anunțului. Încearcă din nou.",
      };
    }

    revalidateTag("wheel-ads", "max");
    revalidatePath("/dashboard/new-add");
    revalidatePath("/dashboard/rims");
    //revalidate path also for the main page where the most recent ads will be posted
    //and also on the catalog page (/anunturi/jante-si-roti)
    revalidatePath("/");
    revalidatePath("/anunturi/jante-si-roti");
    return {
      success: true,
      message: "Anunțul a fost publicat cu succes.",
    };
  } catch (error) {
    console.error("Wheel ad creation failed:", error);
    return {
      success: false,
      formError: "Nu s-a putut publica anunțul din cauza unei erori de rețea.",
    };
  }
}
