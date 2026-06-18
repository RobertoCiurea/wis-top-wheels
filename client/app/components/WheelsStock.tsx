import Image from "next/image";
import BmwWheels from "@/public/images/bmw-wheels-17.webp";
import MercedesWheels from "@/public/images/mercedes-wheels-18.webp";
import WinterTires from "@/public/images/winter-tires-18.webp";
import "@/app/styles/stock.css"
export const WheelsStock = ()=>{
    return(
    <div className="section" id="stock" style={{background: 'var(--surface)', borderTop: '1px solid var(--border)'}} aria-labelledby="wheels-heading">
        <div className="container">
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '12px'}}>
            <div className="reveal visible">
                <div className="eyebrow">Disponibile acum</div>
                <h2 className="display d2" id="wheels-heading">Jante & <span className="accent">Anvelope</span></h2>
            </div>
            <a href="#contact-section" className="btn btn-ghost reveal">Vezi tot stocul →</a>
            </div>
            <div className="stock-grid reveal visible">

            <div className="stock-card">
                <Image src={BmwWheels} alt="Set de jante aliaj BMW 17 inch, negre cu profil sportiv" className="stock-img" style={{objectFit: 'cover'}} />
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
                <Image src={MercedesWheels} alt="Set de jante OEM Mercedes-Benz 18 inch, gri metalizat" className="stock-img" style={{objectFit: 'cover'}} />
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
                <Image src={WinterTires} alt="Set de anvelope de iarnă Bridgestone 225/55 R18 cu profil mediu de cauciuc" className="stock-img" style={{objectFit: 'cover'}} />
                <div className="stock-body">
                <div className="stock-type">Anvelope Iarnă</div>
                <div className="stock-title">Cauciucuri Bridgestone — 225/55 R18</div>
                <div className="stock-meta">Set de 2 anvelope de iarnă, DOT 2020, uzura 6mm. Stare foarte bună.</div>
                <div className="stock-footer">
                    <div className="stock-price">380 <span>RON / bucata</span></div>
                    <a href="https://wa.me/40726547517" className="btn btn-gold btn-sm">Întreabă</a>
                </div>
                </div>
            </div>

            </div>
        </div>
    </div>
    )
}