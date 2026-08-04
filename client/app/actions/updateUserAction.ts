"use server";
import { ActionState } from "@/app/types/types";
import { revalidatePath } from "next/cache";
export async function updateUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //extract the form data
  const id = formData.get("id") as string;
  const username = formData.get("username") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const role = formData.get("role") as string;
  const accessToken = formData.get("accessToken") as string;

  if (!username || !username.trim())
    return { status: 400, error: "Numele de utilizator nu poate fi gol." };

  if (!firstName || !firstName.trim())
    return { status: 400, error: "Prenumele nu poate fi gol." };

  if (!lastName || !lastName.trim())
    return { status: 400, error: "Numele nu poate fi gol." };

  try {
    const response = await fetch(
      `http://localhost:8081/api/admin/users/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: username.trim(),
          firstName: firstName.trim,
          lastName: lastName.trim(),
          role,
        }),
      },
    );
    if (!response.ok) {
      switch (response.status) {
        case 409:
          return { status: 409, error: "Numele de utilizator există deja." };
        case 401:
        case 403:
          return {
            status: response.status,
            error:
              "Sesiunea a expirat sau nu ai drepturile necesare. Conectează-te din nou pentru a continua.",
          };
        default:
          return {
            status: response.status,
            error: "A apărut o eroare la actualizarea utilizatorului.",
          };
      }
    }
    revalidatePath("/dashboard/admin");
    return {
      status: 200,
      message: "Datele utilizatorului au fost salvate cu succes.",
    };
  } catch (error) {
    console.error("Eroare la actualizarea utilizatorului:", error);
    return {
      status: 500,
      error: "Eroare de rețea. Nu s-a putut actualiza utilizatorul.",
    };
  }
}
