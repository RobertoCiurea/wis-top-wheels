import {Header, Hero, About, Services, Categories, WheelsStock, CarsStock, WhyUs, Cta, Contact, Map, Footer, WhatsappFloat} from "@/app/components/components";

export default function Home() {
  return (
    <>
      <Header/>
      <main>
        <Hero/>
        <Services/>
        <section id="despre-noi" className="section">
          <About/>
        </section>
        <Categories/>
        <section id="stoc-jante-anvelope">
          <WheelsStock/>
        </section>
        <section id="masini-vanzare">
          <CarsStock/>
        </section>
        <section id="de-ce-noi">
          <WhyUs/>
        </section>
        <Cta/>
        <section id="contact-section">
          <Contact/>
        </section>
        <section id="locatie">
          <Map/>
        </section>
      </main>
      <Footer/>
      <WhatsappFloat/>
    </>
  );
}
