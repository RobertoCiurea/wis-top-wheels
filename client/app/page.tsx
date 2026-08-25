import {
  Header,
  Hero,
  About,
  Services,
  Categories,
  WheelsStock,
  CarsStock,
  WhyUs,
  Cta,
  Contact,
  Map,
  Footer,
  WhatsappFloat,
} from "@/app/components/components";
import { getWheelAdverts } from "@/services/advertService";
import { CatalogParams } from "./types/types";

export default async function Home() {
  const queryParams: CatalogParams = {
    page: 1,
    limit: 6,
    order: "desc",
  };
  const data = await getWheelAdverts(queryParams);

  return (
    <>
      <main>
        <Hero />
        <Services />
        <section id="despre-noi" className="section">
          <About />
        </section>
        <Categories />
        <section id="stoc-jante-anvelope">
          <WheelsStock wheelAdverts={data?.items} mainPage={true} />
        </section>
        <section id="masini-vanzare">
          <CarsStock />
        </section>
        <section id="de-ce-noi">
          <WhyUs />
        </section>
        <Cta />
        <section id="contact-section">
          <Contact />
        </section>
        <section id="locatie">
          <Map />
        </section>
      </main>
      <WhatsappFloat />
    </>
  );
}
