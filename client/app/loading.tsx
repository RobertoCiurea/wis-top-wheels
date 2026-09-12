export default function Loading() {
  return (
    <main className="status-page status-page--loading" aria-busy="true">
      <div className="status-page__content">
        <span className="status-page__loader" aria-hidden="true" />
        <p className="eyebrow">WIS Top Wheels</p>
        <p className="status-page__loading-label">Se încarcă</p>
      </div>
    </main>
  );
}
