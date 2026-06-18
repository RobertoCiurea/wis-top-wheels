import "@/app/styles/whyus.css"
import { SearchIcon } from "./SVG/SearchIcon"
import { PriceIcon } from "./SVG/PriceIcon"
import { GiftIcon } from "./SVG/GiftIcon"
import { FastIcon } from "./SVG/FastIcon"
import { ShieldIcon } from "./SVG/ShieldIcon"
import { IdeaIcon } from "./SVG/IdeaIcon"
import { Card } from "./Card"
export const WhyUs = ()=>{
    return(
        <section className="section" style={{background:'var(--surface)', borderTop:'1px solid var(--border)'}}>
        <div className="container">
            <div style={{textAlign:'center'}} className="reveal visible">
                <div className="eyebrow" style={{justifyContent:'center'}}>De ce noi?</div>
                    <h2 className="display d2" style={{marginBottom:'16px'}}>Ce ne diferențiază <span className="accent">de alții</span></h2>
                    <p className="lead" style={{margin:'0 auto'}}>Alegem calitatea în locul cantității. Fiecare decizie este luată cu clientul în minte.</p>
                </div>
                <div className="why-grid reveal visible">
                    {/* Card 1*/}
                    <Card
                    order="01"
                        Icon={{src: SearchIcon, color:"rgb(255,255,255)", size:28}} 
                    title="Inspecție riguroasă"
                    text="Fiecare jantă și mașină este verificată manual de tehnicieni experimentați înainte de vânzare."
                    />
                    {/* Card 2 */}
                    <Card
                    order="02"
                    Icon={{src: PriceIcon, color:"rgb(99, 230, 190)", size:28}} 
                    title="Prețuri transparente"
                    text="Niciun cost ascuns. Prețul pe care îl vezi este prețul pe care îl plătești. Negocieri oneste."
                    />

                    {/* Card 3 */}
                    <Card
                    order="03"
                    Icon={{src: FastIcon, color:"rgb(255, 212, 59)", size:28}} 
                    title="Răspuns rapid"
                    text="Răspundem la WhatsApp și telefon în sub 30 de minute în zilele lucrătoare."
                    />
                    {/* Card 4 */}
                    <Card
                    order="04"
                    Icon={{src: ShieldIcon, color:"rgb(116, 192, 252)", size:28}} 
                    title="Garanție post-vânzare"
                    text="Ofertăm suport după cumpărare și garanție pe tot ce vindem. Nu dispărem după tranzacție."
                    />
                
                    {/* Card 5 */}
                    <Card
                    order="05"
                    Icon={{src: GiftIcon, color:"rgb(226, 130, 224)", size:28}} 
                    title="Concursuri săptămânale"
                    text="Participi și poți câștiga vouchere sau reduceri la jante și închirieri."
                    />
            
                    {/* Card 6 */}
                    <Card
                    order="06"
                    Icon={{src: IdeaIcon, color:"rgb(255, 212, 59)", size:28}} 
                    title="Consiliere personalizată"
                    text="Te ajutăm să alegi jantele ideale pentru mașina și stilul tău; recomandări practice și verificări tehnice înainte de livrare."
                    />
                </div>
            </div>
        </section>
    )
}