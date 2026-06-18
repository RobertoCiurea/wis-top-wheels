import Image from "next/image";
import "@/app/styles/stock.css"
import Bmw from "@/public/images/bmw-320.jpg"
import Mercedes from "@/public/images/mercedes-cla-200.jpg"
import Audi from "@/public/images/audi-a4-avant.jpg"
export const CarsStock = ()=>{
    return (
    <div className="section" id="cars" aria-labelledby="cars-heading">
        <div className="container">
            <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'16px', marginBottom:'12px'}}>
            <div className="reveal visible">
                <div className="eyebrow">Import Germania</div>
                <h2 className="display d2" id="cars-heading">Mașini de <span className="accent">vânzare</span></h2>
            </div>
            <a href="#contact-section" className="btn btn-ghost reveal">Contactează-ne →</a>
            </div>
            <div className="stock-grid reveal visible">

            <div className="stock-card">
                <Image src={Bmw} alt="BMW Seria 3 320d xDrive, 2020, vopsea și interior în stare perfectă" className="stock-img" />
                <div className="stock-body">
                <div className="stock-type">BMW · 2020 · 150.000 km</div>
                <div className="stock-title">BMW Seria 3 — 320d xDrive</div>
                <div className="stock-meta">Motor 2.0 diesel, 190 CP. Full options — LED, Navi, Parking. Impecabil.</div>
                <div className="stock-footer">
                    <div className="stock-price">26.500 <span>EUR</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Detalii</a>
                </div>
                </div>
            </div>

            <div className="stock-card">
                <Image src={Mercedes} alt="Mercedes-Benz CLA 200, 2019, vopsea gri metalizat cu interior gri" className="stock-img" />
                <div className="stock-body">
                <div className="stock-type">Mercedes · 2019 · 180.000 km</div>
                <div className="stock-title">Mercedes-Benz CLA 200</div>
                <div className="stock-meta">Benzină 1.6T, 156 CP. AMG Line, Display Key, Comand Online.</div>
                <div className="stock-footer">
                    <div className="stock-price">21.900 <span>EUR</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Detalii</a>
                </div>
                </div>
            </div>

            <div className="stock-card">
                <Image src={Audi} alt="Audi A4 Avant 2.0 TDI, 2021, vopsea gri cu interior bej" className="stock-img" />
                <div className="stock-body">
                <div className="stock-type">Audi · 2021 · 90.000 km</div>
                <div className="stock-title">Audi A4 Avant — 2.0 TDI</div>
                <div className="stock-meta">150 CP, S-Tronic. Virtual Cockpit, Apple CarPlay, Lane Assist.</div>
                <div className="stock-footer">
                    <div className="stock-price">29.800 <span>EUR</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Detalii</a>
                </div>
                </div>
            </div>

            </div>
        </div>
    </div>
    )
}