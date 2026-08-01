import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }
  const response = await fetch("http://localhost:8081/api/dashboard", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (response.status === 401)
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  else if (response.status == 403) return "Forbidden";
  return <></>;
}
