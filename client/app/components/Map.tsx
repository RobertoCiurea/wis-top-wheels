import "@/app/styles/map.css"
import Image from "next/image"
import WiSTopWheelsImage from "@/public/images/wtsc.png"
export const Map = ()=>{
    return(
        <section className="map-section">
            <div className="map-wrapper">
                <div className="map-frame">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d772.8734621704002!2d24.937738089936552!3d44.72140136475622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b29f56140696eb%3A0xf30d8d6ec3065579!2sNIKLAS%20VALMAR%20JUNIOR%20SRL!5e0!3m2!1sro!2sro!4v1781435922317!5m2!1sro!2sro"
                    loading="lazy"
                    title="Locație WIS Top Wheels"
                ></iframe>
                </div>
                <div className="map-panel">
                <div>
                    <div className="map-logo">
                        <Image
                            src={WiSTopWheelsImage}
                            alt="Wis Top Wheels & Cars"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="map-detail">
                    <div className="map-ico">📍</div>
                    <p><strong>Adresă</strong>Comuna Suseni Sat Cersani nr 355, <br/> 117695 Argeș</p>
                </div>
                <div className="map-detail">
                    <div className="map-ico">📞</div>
                    <p><strong>Telefon</strong><a href="tel:+40726547517" style={{color:"var(--gold)"}}>+40 726 547 517</a></p>
                </div>
                <div className="map-detail">
                    <div className="map-ico">⏰</div>
                    <p><strong>Program</strong>Luni–Vin: 09:00–18:00<br/>Sâmbătă: 09:00–14:00</p>
                </div>
                <a href="https://maps.google.com" target="_blank" className="btn btn-gold" style={{justifyContent:"center"}}>Deschide în Google Maps</a>
                </div>
            </div>
        </section>
    )
}