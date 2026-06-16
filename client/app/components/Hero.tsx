import "@/app/styles/hero.css"
export const Hero = ()=>{
    return(
<section className="hero" id="hero">
  <div className="hero-bg"></div>
  <img
    src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1600&q=80"
    alt="Mașină premium"
    className="hero-img"
  />
  <div className="hero-overlay"></div>
  <div className="hero-overlay-bottom"></div>
  <div className="container hero-content">
    <h1 className="display d1">
      Calitate <br/>
      <em>fără compromis</em>
    </h1>
    <p className="hero-sub">Jante premium, mașini second-hand de import Germania și servicii de închiriere — totul într-un singur loc, cu garanție și transparență totală.</p>
    <div className="hero-actions">
      <a href="#stock" className="btn btn-gold btn-lg">Vezi Stocul</a>
      <a href="#contact" className="btn btn-ghost btn-lg">Contactează-ne</a>
    </div>
    <div className="hero-stats">
      <div className="stat">
        <span className="stat-num">100<span className="accent">+</span></span>
        <span className="stat-lbl">Jante disponibile</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <span className="stat-num">5<span className="accent">+</span></span>
        <span className="stat-lbl">Ani experiență</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat">
        <span className="stat-num">98<span className="accent">%</span></span>
        <span className="stat-lbl">Clienți mulțumiți</span>
      </div>
    </div>
  </div>
</section>
    )
}