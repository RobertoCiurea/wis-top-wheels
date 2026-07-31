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
  if (!response.ok) return "Error";
  const data = await response.text();
  return (
    <>
      <h1>Welcome to dashboard!</h1>
      <h3>{data}</h3>
    </>
  );
}
