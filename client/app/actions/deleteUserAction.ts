"use server";

import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
export async function deleteUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;
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
    const response = await fetch(`${apiBaseUrl}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
            error: "Utilizatorul nu a fost gasit.",
          };
        default:
          return {
            status: response.status,
            error: "A apărut o eroare la ștergerea utilizatorului.",
          };
      }
    }
    revalidatePath("/dashboard/admin");
    return {
      status: 200,
      message: "Utilizatorul a fost eliminat cu succes!",
    };
  } catch (error) {
    console.error("Eroare la actualizarea utilizatorului:", error);
    return {
      status: 500,
      error: "Eroare de rețea. Nu s-a putut șterger utilizatorul.",
    };
  }
}
