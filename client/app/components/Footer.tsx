"use client"
import { useState, useRef } from "react"
import "@/app/styles/footer.css"
import Image from "next/image"
import Logo from "@/public/logo.png"
import { Socials } from "./Socials"
export const Footer = ()=>{
    const [newsletter, setNewsletter] = useState("")
    const [newsletterError, setNewsletterError]= useState("")
    const buttonRef = useRef<HTMLButtonElement>(null);
    const onSubmit = (e: React.SubmitEvent<HTMLFormElement>)=>{
        console.log("Submited")
        console.log("Email is: " + newsletter)
        e.preventDefault();
        if(newsletter === ""){
            setNewsletterError("Email-ul este obligatoriu");
            console.log(newsletterError)
            return;
        }
        if(!validateEmail(newsletter)){
            setNewsletterError("Email-ul nu este valid");
            console.log(newsletterError)
            return;
        }
        if(buttonRef.current){
            console.log("Hello, ref")
                buttonRef.current.disabled = true;
                buttonRef.current.classList.add('btn-success');
                buttonRef.current.textContent = "Trimis!";
                setTimeout(() => {
                    buttonRef.current!.textContent = "Trimite";
                    buttonRef.current!.disabled = false;
                    buttonRef.current!.classList.remove('btn-success');
                }, 3000);
            }
            resetState();
    }

    const resetState = ()=>{
        setNewsletter("")
        setNewsletterError("")
    }

    const validateEmail = (email: string) =>{
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return String(email).toLocaleLowerCase().match(regex)
 
    }

    return (
        <footer className="footer">
        <div className="container">
            <div className="footer-grid">
            <div className="footer-brand">
                <div className="nav-logo">
                <Image src={Logo} alt="WIS Top Wheels Logo" />
                </div>
                <p>Furnizorul tău de încredere pentru jante, mașini și servicii auto în Argeș. Calitate verificată, prețuri corecte, oameni de cuvânt.</p>
                <Socials/>
            </div>
            <div>
                <div className="footer-title">Servicii</div>
                <div className="footer-links">
                <a href="#stoc-jante-anvelope">Jante & Anvelope</a>
                <a href="#masini-vanzare">Mașini Import Germania</a>
                <a href="#contact">Vulcanizare & Direcții auto</a>
                </div>
            </div>
            <div>
                <div className="footer-title">Companie</div>
                <div className="footer-links">
                <a href="#despre-noi">Despre noi</a>
                <a href="#contact-section">Contact</a>
                <a href="/privacy">Politică de confidențialitate</a>
                <a href="/terms">Termeni și condiții</a>
                </div>
            </div>
            <div>
                <div className="footer-title">Contact rapid</div>
                <div className="footer-links" style={{marginBottom:20}}>
                <a href="tel:+40726547517">📞 +40 726 547 517</a>
                <a href="https://wa.me/40726547517">💬 WhatsApp</a>
                <a href="https://www.google.com/maps?cid=17513810032771618169&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=ro&gl=RO&source=embed" rel="noopener noreferrer">📍Suseni, Argeș</a>
                </div>
                <div className="footer-newsletter">
                <div className="footer-title">Noutăți stoc</div>
                <form onSubmit={onSubmit} className="newsletter-form">
                    <input
                     name="newsletter"
                     type="email"
                     className="newsletter-input"
                     aria-label="Email pentru noutăți stoc"
                     style={{borderColor: `${newsletterError ? 'rgba(234, 9, 9, 0.5)' : 'var(--border)'} `}}
                     placeholder="Email-ul tău"
                     value={newsletter}
                     onChange={(e)=>setNewsletter(e.target.value)}
                     required
                         />
                    <button ref={buttonRef} type="submit" className="btn btn-gold btn-sm" aria-label="Trimite email-ul">Trimite</button>
                </form>
                {newsletterError && <div className="form-error" role="alert">{newsletterError}</div>}
                </div>
            </div>
            </div>
            <div className="footer-bottom">
            <p>© 2026 WIS Top Wheels · Toate drepturile rezervate</p>
            <div className="trust-badges">
                <span className="trust-badge"><span className="trust-dot"></span>Stoc verificat</span>
                <span className="trust-badge"><span className="trust-dot"></span>Transparență totală</span>
                <span className="trust-badge"><span className="trust-dot"></span>Import certificat</span>
            </div>
            </div>
        </div>
        </footer>
    )

}