"use server";
import { auth } from "@/auth";
import { ActionState } from "../types/types";
import { revalidatePath } from "next/cache";
export async function deleteMessageAction(
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
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  const accessToken = session.accessToken;
  const messageId = formData.get("contact-id") as string;
  if (messageId === null || messageId.trim() === "") {
    return {
      status: 400,
      error: "ID-ul mesajului nu poate fi gol.",
    };
  }
  try {
    const response = await fetch(`${apiBaseUrl}/api/contact/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: response.status,
        error:
          errorData.error ||
          errorData.message ||
          "Eroare la ștergerea mesajului.",
      };
    }
    revalidatePath("/dashboard/messages");
    return {
      status: 200,
      message: "Mesajul a fost șters cu succes.",
    };
  } catch (error) {
    console.error("Error deleting message:", error);
    return {
      status: 500,
      error:
        "A apărut o eroare la ștergerea mesajului. Vă rugăm să încercați din nou.",
    };
  }
}
