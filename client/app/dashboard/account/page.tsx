import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AccessDenied } from "@/app/components/AccessDenied";

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/account");
  }
  const response = await fetch(`${process.env.SERVER_URL}/api/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (response.status === 401 || response.status === 403) {
    return <AccessDenied />;
  }
  const data = await response.json;
  console.log(data);
}
