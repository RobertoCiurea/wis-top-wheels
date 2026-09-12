"use server";
import { signOut } from "@/auth";
export default async function LogoutAction() {
  console.log("Logging out...");
  await signOut({ redirectTo: "/" });
}
