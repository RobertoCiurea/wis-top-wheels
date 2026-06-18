import "@/app/styles/services.css"
export const Services = ()=>{
    return(
    <section className="services-strip">
        <div className="services-strip-inner">
            <a href="#stock" className="service-tab">
            <div className="svc-icon">🗝️</div>
            <div>
                <div className="svc-label">Magazin</div>
                <div className="svc-title">Jante & Anvelope</div>
            </div>
            </a>
            <a href="#cars" className="service-tab">
            <div className="svc-icon">🚗</div>
            <div>
                <div className="svc-label">Vânzare</div>
                <div className="svc-title">Mașini Import Germania</div>
            </div>
            </a>
            <a href="#contact" className="service-tab">
            <div className="svc-icon">🔧</div>
            <div>
                <div className="svc-label">Serviciu</div>
            <div className="svc-title">Vulcanizare & Direcție roți 3D</div>
            </div>
            </a>
        </div>
    </section>

    )
}