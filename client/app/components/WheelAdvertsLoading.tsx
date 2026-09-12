import "@/app/styles/stock.css";

export function WheelAdvertsLoading() {
  return (
    <section
      className="section stock-loading"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="container">
        <div className="stock-loading__header">
          <div>
            <div className="stock-loading__eyebrow" aria-hidden="true" />
            <div className="stock-loading__title" aria-hidden="true" />
          </div>
          <div className="stock-loading__filter" aria-hidden="true" />
        </div>

        <div className="stock-loading__grid" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="stock-loading__card" key={item}>
              <div className="stock-loading__media" />
              <div className="stock-loading__body">
                <div className="stock-loading__line stock-loading__line--short" />
                <div className="stock-loading__line" />
                <div className="stock-loading__line stock-loading__line--price" />
              </div>
            </div>
          ))}
        </div>

        <p className="stock-loading__label">Se încarcă anunțurile</p>
      </div>
    </section>
  );
}
