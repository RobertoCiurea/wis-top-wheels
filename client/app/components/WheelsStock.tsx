import Image from "next/image";
import BmwWheels from "@/public/images/bmw-wheels-17.webp";
import MercedesWheels from "@/public/images/mercedes-wheels-18.webp";
import WinterTires from "@/public/images/winter-tires-18.webp";
import "@/app/styles/stock.css"
export const WheelsStock = ()=>{
    return(
        <section className="section" id="stock" style={{background: 'var(--surface)', borderTop: '1px solid var(--border)'}}>
        <div className="container">
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '12px'}}>
            <div className="reveal visible">
                <div className="eyebrow">Disponibile acum</div>
                <h2 className="display d2">Jante & <span className="accent">Anvelope</span></h2>
            </div>
            <a href="#contact" className="btn btn-ghost reveal">Vezi tot stocul →</a>
            </div>
            <div className="stock-grid reveal visible">

            <div className="stock-card">
                <Image src={BmwWheels} alt="Jante aliaj 17 inch" className="stock-img" style={{objectFit: 'cover'}} />
                <div className="stock-body">
                <div className="stock-type">Jante Aliaj</div>
                <div className="stock-title">Set Jante BMW 17"</div>
                <div className="stock-meta">Aliaj de aluminiu, 205/55/R17, 5×120, ET30. Stare excelentă, fără lovituri.</div>
                <div className="stock-footer">
                    <div className="stock-price">1.750 <span>RON / set</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Întreabă</a>
                </div>
                </div>
            </div>

            <div className="stock-card">
                <Image src={MercedesWheels} alt="Jante OEM 18 inch" className="stock-img" style={{objectFit: 'cover'}} />
                <div className="stock-body">
                <div className="stock-type">Jante OEM</div>
                <div className="stock-title">Set Jante Mercedes 18"</div>
                <div className="stock-meta">Originale OEM Mercedes-Benz, 245/45/R18 ET43/52.5</div>
                <div className="stock-footer">
                    <div className="stock-price">3.450 <span>RON / set</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Întreabă</a>
                </div>
                </div>
            </div>

            <div className="stock-card">
                <Image src={WinterTires} alt="Anvelope iarna" className="stock-img" style={{objectFit: 'cover'}} />
                <div className="stock-body">
                <div className="stock-type">Anvelope Iarnă</div>
                <div className="stock-title">Cauciucuri Bridgeston — 225/55 R18</div>
                <div className="stock-meta">Set de 2 anvelope de iarnă, DOT 2020, uzura 6mm. Stare foarte bună.</div>
                <div className="stock-footer">
                    <div className="stock-price">380 <span>RON / bucata</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Întreabă</a>
                </div>
                </div>
            </div>

            </div>
        </div>
        </section>
    )
}