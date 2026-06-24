import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MenuSection from "@/components/MenuSection";
import Contact from "@/components/Contact";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <Header />
      <main>
        <Hero />
        <About />
        <MenuSection />
      </main>
      <Contact />
    </>
  );
}
