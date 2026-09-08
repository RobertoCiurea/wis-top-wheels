import "@/app/styles/admin.css";
export const AccessDenied = () => {
  return (
    <section className="dashboard-content">
      <div className="admin-status-card error">
        <h1>Acces neautorizat</h1>
        <p>
          Sesiunea a expirat sau nu ai permisiuni suficiente pentru a vedea
          lista utilizatorilor.
        </p>
        <a
          href="/api/auth/signin?callbackUrl=/dashboard"
          className="modal-action-button primary"
        >
          Conectează-te din nou
        </a>
      </div>
    </section>
  );
};
