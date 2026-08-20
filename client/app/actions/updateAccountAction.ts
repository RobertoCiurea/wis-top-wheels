"use server";
import { revalidatePath } from "next/cache";
import { ActionState } from "../types/types";
import { auth } from "@/auth";
export async function updateAccount(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = formData.get("username") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  const session = await auth();
  if (!session || !session.user) {
    return {
      status: 401,
      error: "Trebuie să fii autentificat pentru a accesa această resursă.",
    };
  }

  const accessToken = session.accessToken;

  if (!username || !username.trim()) {
    return { status: 400, error: "Numele de utilizator nu poate fi gol." };
  }
  if (!firstName || !firstName.trim()) {
    return { status: 400, error: "Prenumele nu poate fi gol." };
  }
  if (!lastName || !lastName.trim()) {
    return { status: 400, error: "Numele nu poate fi gol." };
  }
  if (!email || !email.trim()) {
    return { status: 400, error: "Emailul nu poate fi gol." };
  }
  const data = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  try {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
    const response = await fetch(`${apiBaseUrl}/api/account`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      switch (response.status) {
        case 409:
          return {
            status: 409,
            error: "Există deja un utilizator cu acest nume sau email",
          };
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
            error: "A apărut o eroare la acutalizarea contului.",
          };
      }
    }
    revalidatePath("/dashboard/account");
    return {
      status: 200,
      message: "Datele au fost actualizate cu succes!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "Eroare de rețea. Nu s-au putut actualiza datele.",
    };
  }
}
