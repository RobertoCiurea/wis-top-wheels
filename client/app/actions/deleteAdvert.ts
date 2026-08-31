"use server";
import { revalidatePath } from "next/cache";
import { ActionState } from "../types/types";
import { auth } from "@/auth";
export async function deleteAdvert(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      status: 401,
      error: "Trebuie să fii autentificat pentru a accesa această resursă.",
    };
  }
  const advertId = formData.get("advert-id");
  const accessToken = session.accessToken;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

  try {
    const response = await fetch(`${apiBaseUrl}/api/ad/wheels/${advertId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.log(response);
      switch (response.status) {
        case 401:
        case 403:
          return {
            status: response.status,
            error:
              "Sesiunea a expirat sau nu ai drepturile necesare. Conectează-te din nou pentru a continua.",
          };
        case 404:
          return {
            status: response.status,
            error: "Anunțul nu a fost gasit.",
          };
        case 409: {
          return {
            status: response.status,
            error: "Anunțul trebuie dezactivat pentru a putea fi șters.",
          };
        }
        default:
          return {
            status: response.status,
            error: response.statusText,
          };
      }
    }
    revalidatePath("/");
    revalidatePath("/anunturi/jante-si-roti");
    revalidatePath("/dashboard/rims");
    revalidatePath(`/anunturi/jante-si-roti/${advertId}`);
    return {
      status: 200,
      message: "Anunțul a fost șters cu succes.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Eroare de rețea. Încearcă din nou.",
    };
  }
}
