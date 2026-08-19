"use server";
import { auth } from "@/auth";
import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";
export async function addUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  //extract all the form data
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  const session = await auth();
  if (!session || !session.user) {
    return {
      status: 401,
      error: "Trebuie să fii autentificat pentru a accesa această resursă.",
    };
  }

  const accessToken = session.accessToken;

  if (!firstName || !firstName.trim()) {
    return { status: 400, error: "Prenumele nu poate fi gol." };
  }
  if (!lastName || !lastName.trim()) {
    return { status: 400, error: "Numele nu poate fi gol." };
  }
  if (!username || !username.trim()) {
    return { status: 400, error: "Numele de utilizator nu poate fi gol." };
  }
  if (!email || !email.trim()) {
    return { status: 400, error: "Emailul nu poate fi gol." };
  }
  if (!password || !password.trim()) {
    return { status: 400, error: "Parola nu poate fi goală." };
  }
  const data = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    password: password,
    role: role,
  };

  try {
    const response = await fetch("http://localhost:8081/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      switch (response.status) {
        case 409:
          return { status: 409, error: "Utilizator există deja." };
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
            error: "A apărut o eroare la crearea utilizatorului.",
          };
      }
    }
    revalidatePath("/dashboard/admin");
    return {
      status: 200,
      message: "Datele utilizatorului au fost salvate cu succes.",
    };
  } catch (error) {
    console.error("Eroare la crearea utilizatorului:", error);
    return {
      status: 500,
      error: "Eroare de rețea. Nu s-a putut crea utilizatorul.",
    };
  }
}
