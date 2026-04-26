import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import Services from "@/components/home/Services";
import Marquee from "@/components/home/Marquee";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import Pricing from "@/components/home/Pricing";
import CtaSection from "@/components/home/CtaSection";
import LeadMagnet from "@/components/home/LeadMagnet";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <Services />
      <Marquee />
      <Process />
      <Testimonials />
      <Pricing />
      <CtaSection />
      <LeadMagnet />
      <Footer />
    </>
  );
}
