"use server";

import { revalidatePath } from "next/cache";
import { ActionState } from "../types/types";
import { auth } from "@/auth";
export async function disconnectFromOlx(
  prevState: ActionState,
): Promise<ActionState> {
  const session = await auth();
  if (!session || !session.user) {
    return {
      status: 401,
      error: "Trebuie să fii autentificat pentru a accesa această resursă.",
    };
  }

  const accessToken = session.accessToken;
  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
    const response = await fetch(`${apiBaseUrl}/api/olx/auth/disconnect`, {
      method: "DELETE",
      headers: {
        Auhtorization: `Bearer ${accessToken}`,
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
            error: "Conexiunea nu a fost gasită.",
          };
        default:
          return {
            status: response.status,
            error: "A apărut o eroare la deconectarea de la serviciul OLX.",
          };
      }
    }
    revalidatePath("/dashboard");
    return {
      status: 200,
      message: "Te-ai deconectat cu succes de la serviciul OLX",
    };
  } catch (error) {
    console.log("Error " + error);
    return {
      status: 500,
      error: "Eroare de rețea. Încearcă din nou.",
    };
  }
}
