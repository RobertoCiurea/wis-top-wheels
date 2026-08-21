import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AccessDenied } from "@/app/components/AccessDenied";
import "@/app/styles/dashboard.css";
import { MyAccount } from "@/app/components/MyAccount";
import { UserCardProps } from "@/app/types/types";
export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/account");
  }
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  const response = await fetch(`${apiBaseUrl}/api/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  if (response.status === 401 || response.status === 403) {
    return <AccessDenied />;
  }
  const data = (await response.json()) as UserCardProps;
  return (
    <div className="dashboard-content">
      <h1>Contul meu</h1>
      <MyAccount
        id={data.id}
        username={data.username}
        firstName={data.firstName}
        lastName={data.lastName}
        email={data.email}
        roles={data.roles}
        accessToken={session.accessToken}
      />
    </div>
  );
}
