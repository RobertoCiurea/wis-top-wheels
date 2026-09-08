import Link from "next/link";
import { House } from "lucide-react";

export default function NotFound() {
  return (
    <main className="status-page" aria-labelledby="not-found-title">
      <div className="status-page__content">
        <p className="eyebrow">WIS Top Wheels</p>
        <p className="status-page__code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title" className="display d3">
          Pagina nu a fost găsită
        </h1>
        <p className="lead status-page__message">
          Ne pare rău, pagina pe care o cauți nu există sau nu mai este
          disponibilă.
        </p>
        <Link href="/" className="btn btn-gold btn-lg">
          <House aria-hidden="true" />
          Înapoi acasă
        </Link>
      </div>
    </main>
  );
}
