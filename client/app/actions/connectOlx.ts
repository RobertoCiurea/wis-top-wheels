"use server";
import { auth } from "@/auth";
import { ActionState } from "../types/types";
import { redirect } from "next/navigation";
export async function connectToOlx(
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

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

  let olxUrl = "";
  try {
    const response = await fetch(`${apiBaseUrl}/api/olx/auth/setup`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      return {
        status: response.status,
        message: "Eroare de conexiune. Încearcă din nou.",
      };
    }
    const data = await response.text();
    if (!data || !data.startsWith("http")) {
      return {
        status: 500,
        error: "URL-ul de autorizare generat de sistem este invalid.",
      };
    }
    olxUrl = data;
  } catch (error) {
    console.error("Connection error:", error);
    return {
      status: 500,
      error: "Eroare de rețea. Procedura a fost întreruptă.",
    };
  }
  if (olxUrl) redirect(olxUrl);
  return {
    status: 500,
    error: "Eroare de rețea. Procedura a fost întreruptă.",
  };
}
