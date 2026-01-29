import HeaderNavigation from "@/components/HeaderNavigation";
import HeroSection from "@/components/HeroSection";
import OurTeam from "@/components/OurTeam";
import Clients from "@/components/Clients";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeaderNavigation />
      <HeroSection />
      <OurTeam />
      <Clients />
      <Footer />
    </main>
  );
}
