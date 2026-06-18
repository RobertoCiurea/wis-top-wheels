import "@/app/styles/cta.css"

export const Cta = ()=>{
    return(
        <section className="cta-band" aria-labelledby="cta-heading">
        <div className="cta-inner">
            <div className="cta-copy">
            <h2 id="cta-heading">Găsești ce cauți?</h2>
            <p>Spune-ne ce vrei și te ajutăm să găsești exact ce ai nevoie — jante, mașini sau rezervare servicii.</p>
            </div>
            <div className="cta-actions">
            <a href="https://wa.me/40726547517" className="btn btn-dark btn-lg">💬 WhatsApp</a>
            <a href="tel:+40726547517" className="btn btn-white btn-lg">📞 Sună acum</a>
            </div>
        </div>
        </section>
    )
}