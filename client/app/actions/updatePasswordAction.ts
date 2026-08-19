"use server";
import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
export async function updatePassword(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("password") as string;
  const session = await auth();
  if (!session || !session.user) {
    return {
      status: 401,
      error: "Trebuie să fii autentificat pentru a accesa această resursă.",
    };
  }

  const accessToken = session.accessToken;

  console.log(oldPassword);
  console.log(newPassword);
  console.log(accessToken);

  try {
    const response = await fetch(
      `${process.env.SERVER_URL}/api/account/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      },
    );
    if (!response.ok) {
      console.log(response);
      switch (response.status) {
        case 401:
          return {
            status: response.status,
            error: "Parola nu corespunde!",
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
      message: "Parola a fost actualizată cu succes!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "Eroare de rețea. Nu s-au putut actualiza datele.",
    };
  }
}
