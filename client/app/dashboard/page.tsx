import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { OlxConnect, OlxDisconnect } from "@/app/components/components";
import { checkOlxConnectionStatus } from "@/services/olxService";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Link from "next/link";
import "@/app/styles/olx-connect.css";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const isConnected = await checkOlxConnectionStatus();
  if (isConnected) {
    return (
      <section
        className="olx-connect olx-connect--connected"
        aria-labelledby="olx-connected-title"
      >
        <div className="olx-connect__content">
          <p className="eyebrow">Integrare OLX</p>
          <div className="olx-connect__heading-row">
            <span className="olx-connect__connected-icon" aria-hidden="true">
              <CheckCircle2 size={22} />
            </span>
            <h1 id="olx-connected-title" className="display d3">
              Contul OLX este conectat
            </h1>
          </div>
          <p className="olx-connect__description">
            Contul tău este sincronizat și pregătit pentru administrarea
            anunțurilor OLX din aplicație.
          </p>
        </div>
        <div className="olx-connect__actions">
          <Link href="/dashboard/rims" className="btn btn-gold">
            Vezi anunțurile
            <ExternalLink size={16} aria-hidden="true" />
          </Link>
          <Link href="/dashboard/new-add" className="btn btn-ghost">
            Adaugă un anunț
          </Link>
          <OlxDisconnect />
        </div>
      </section>
    );
  }
  return <OlxConnect />;
}
