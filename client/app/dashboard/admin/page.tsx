import { UserCard, AddUser, AccessDenied } from "@/app/components/components";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserCardProps } from "@/app/types/types";
import "@/app/styles/admin.css";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard/admin");
  }
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";
  const response = await fetch(`${apiBaseUrl}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    return <AccessDenied />;
  }

  if (!response.ok) {
    return (
      <section className="dashboard-content">
        <div className="admin-status-card error">
          <h1>Nu s-a putut încărca lista</h1>
          <p>Te rugăm să încerci din nou peste câteva momente.</p>
        </div>
      </section>
    );
  }

  const data = (await response.json()) as UserCardProps[];

  return (
    <section className="dashboard-content">
      <h1>Lista Staff</h1>
      <AddUser />
      <div className="users-grid">
        {data && data.length > 0 ? (
          data.map((user: UserCardProps) => (
            <UserCard
              key={user.id}
              id={user.id}
              username={user.username}
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              roles={user.roles}
              currentUserEmail={session.user.email}
            />
          ))
        ) : (
          <p>Nu există utilizatori de afișat.</p>
        )}
      </div>
    </section>
  );
}
