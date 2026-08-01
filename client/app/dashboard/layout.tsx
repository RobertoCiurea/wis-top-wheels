import { Header, Footer, Sidebar } from "@/app/components/components";
import "@/app/styles/dashboard.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="dashboard-container">
        <div className="dashboard-group">
          {/* Left side - sidebar */}
          <Sidebar />
          {/*Right side - dashboard content */}
          <div className="dashboard-content">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
