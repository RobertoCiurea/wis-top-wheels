import { Sidebar } from "@/app/components/components";
import "@/app/styles/dashboard.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panou administrare | WIS Top Wheels",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dashboard-container">
      <div className="dashboard-group">
        <Sidebar />
        <div className="dashboard-content">{children}</div>
      </div>
    </main>
  );
}
