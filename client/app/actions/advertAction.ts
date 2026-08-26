"use server";
import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
export async function advertAction(
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
  const advertAction = formData.get("advert-action");
  const accessToken = session.accessToken;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

  const payload = {
    action: advertAction,
    isSuccess: true,
  };
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/ad/wheels/${advertId}/action`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      const body = await response.json();
      console.log(body);
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

        default:
          return {
            status: response.status,
            error: body.error.detail,
          };
      }
    }
    revalidatePath("/");
    revalidatePath("/anunturi/jante-si-roti");
    revalidatePath("/dashboard/rims");
    return {
      status: 200,
      message: "Anunțul a fost modificat cu succes.",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "Eroare de rețea. Încearcă din nou.",
    };
  }
}
