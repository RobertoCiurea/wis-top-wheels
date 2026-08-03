"use server";

import { headers } from "next/headers";
import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";

export async function deleteUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = formData.get("id") as string;
  const accessToken = formData.get("accessToken") as string;
  try {
    const response = await fetch(
      `http://localhost:8081/api/admin/users/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
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
