import "@/app/styles/contact.css";
import {ContactForm} from "@/app/components/ContactForm";
import { Socials } from "./Socials";

export const Contact = ()=>{
    return(
        <section className="section" id="contact">
        <div className="container">
            <div className="eyebrow reveal visible">Ia legătura</div>
            <div className="section-header reveal visible">
            <h2 className="display d2">Contactează-ne <span className="accent">acum</span></h2>
            </div>
            <div className="contact-grid">
            <div className="contact-info reveal visible visible">
                <div className="info-block">
                <div className="info-icon">📍</div>
                <div className="info-body">
                    <h4>Adresă</h4>
                    <p>Comuna Suseni Sat Cersani nr 355, <br/> 117695 Argeș</p>
                </div>
                </div>
                <div className="info-block">
                <div className="info-icon">📞</div>
                <div className="info-body">
                    <h4>Telefon</h4>
                    <a href="tel:+40726547517">+40 726 547 517</a>
                </div>
                </div>
                <div className="info-block">
                <div className="info-icon">⏰</div>
                <div className="info-body">
                    <h4>Program</h4>
                    <p>Luni – Vineri: 09:00 – 18:00<br/>Sâmbătă: 09:00 – 14:00<br/>Duminică: Închis</p>
                </div>
                </div>
                <div className="info-block">
                <div className="info-icon">📲</div>
                <div className="info-body">
                    <h4>Social Media</h4>
                   <Socials/>
                </div>
                </div>
            </div>
            
                <ContactForm/>

            </div>
        </div>
        </section>

    )

}