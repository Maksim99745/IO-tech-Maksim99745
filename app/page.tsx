import { Metadata } from "next";
import HeaderNavigation from "@/components/HeaderNavigation";
import HeroSection from "@/components/HeroSection";
import ServicesList from "@/components/ServicesList";
import OurTeam from "@/components/OurTeam";
import Clients from "@/components/Clients";
import Footer from "@/components/Footer";
import Image from "next/image";

export const metadata: Metadata = {
  title: "IO Tech | Home",
  description: "IO Tech - Your trusted technology partner",
  openGraph: {
    title: "IO Tech",
    description: "IO Tech - Your trusted technology partner",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col relative overflow-x-hidden">
      <div className="relative h-[850px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/Home  bg image.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(271.47deg, rgba(75, 38, 21, 0.28) 1.2%, rgba(75, 38, 21, 0.68) 86.38%)`,
            }}
          />
        </div>
        <div className="relative z-10 h-full flex flex-col">
          <HeaderNavigation />
          <HeroSection />
        </div>
      </div>
      <OurTeam />
      <Clients />
      <Footer />
    </main>
  );
}
