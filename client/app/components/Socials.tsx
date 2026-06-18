import { WhatsappIcon } from "./SVG/WhatsappIcon"
import { InstagramIcon } from "./SVG/InstagramIcon"
import { TiktokIcon } from "./SVG/TiktokIcon"
export const Socials = ()=>{
    return (
        <div className="social-row">
            <a href="https://wa.me/40726547517" target="_blank" className="social-btn" aria-label="WhatsApp">
                <WhatsappIcon color="rgb(255,255,255)" size={42}/>
            </a>
            <a href="https://www.instagram.com/wis_wheels_cars/" target="_blank" className="social-btn" aria-label="Instagram">
                <InstagramIcon color="rgb(255,255,255)" size={42}/>
            </a>
            <a href="https://www.tiktok.com/@wis_wheels_cars" target="_blank" className="social-btn" style={{width:38, height: "auto"}} aria-label="TikTok">
                <TiktokIcon color="rgb(255,255,255)" size={38}/>
            </a>
        </div>
    )
}