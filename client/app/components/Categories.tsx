import "@/app/styles/categories.css"
import Image from "next/image";
import WheelsImage from "@/public/images/wheels.png";
import SellingImage from "@/public/images/koleos.jpg";
import ServiceImage from "@/public/images/vulcanizare.jpg";
export const Categories = ()=>{
    return(

<section style={{ padding: "0 0 96px" }} id="services">
  <div className="container">
    <div className="eyebrow reveal visible">Ce oferim</div>
    <div className="section-header revea visible">
      <h2 className="display d2">Serviciile <span className="accent">noastre</span></h2>
    </div>
    <div className="cat-grid reveal visible">
      <a href="#stock" className="cat-card">
        <Image src={WheelsImage} alt="Jante premium" className="cat-bg" />
        <div className="cat-overlay"></div>
        <div className="cat-content">
          <div className="cat-tag">Magazin</div>
          <div className="cat-title">Jante &<br/>Anvelope</div>
          <div className="cat-link">Explorează stocul <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </div>
      </a>
      <a href="#cars" className="cat-card">
        <Image src={SellingImage} alt="Mașini de vânzare" className="cat-bg" />
        <div className="cat-overlay"></div>
        <div className="cat-content">
          <div className="cat-tag">Import Germania</div>
          <div className="cat-title">Mașini de<br/>vânzare</div>
          <div className="cat-link">Vezi mașinile <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </div>
      </a>
      <a href="#rentals" className="cat-card">
        <Image src={ServiceImage} alt="Închirieri auto" className="cat-bg" />
        <div className="cat-overlay"></div>
        <div className="cat-content">
          <div className="cat-tag">Serviciu</div>
          <div className="cat-title">Vulcanizare<br/>auto</div>
          <div className="cat-link">Programează-te acum <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </div>
      </a>
    </div>
  </div>
</section>
    )
}