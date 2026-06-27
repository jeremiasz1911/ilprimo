import About from "@/components/About";
import Contact from "@/components/Contact";
import CursorGlow from "@/components/CursorGlow";
import CustomSection from "@/components/CustomSection";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import SiteHeader from "@/components/SiteHeader";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeStyles from "@/components/ThemeStyles";
import {
  getActivePageSections,
  getSiteSettings,
} from "@/lib/page-service";
import { getSiteTheme } from "@/lib/theme-service";
import type { PageSection } from "@/lib/types";

export const dynamic = "force-dynamic";

function renderSection(
  section: PageSection,
  settings: Awaited<ReturnType<typeof getSiteSettings>>,
) {
  switch (section.type) {
    case "hero":
      return <Hero key={section.id} section={section} />;
    case "about":
      return <About key={section.id} section={section} />;
    case "menu":
      return <MenuSection key={section.id} section={section} />;
    case "contact":
      return (
        <Contact key={section.id} section={section} settings={settings} />
      );
    case "custom":
      return <CustomSection key={section.id} section={section} />;
    default:
      return null;
  }
}

export default async function Home() {
  const [sections, settings, theme] = await Promise.all([
    getActivePageSections(),
    getSiteSettings(),
    getSiteTheme(),
  ]);

  return (
    <ThemeProvider theme={theme}>
      <ThemeStyles theme={theme} />
      <CursorGlow />
      <SiteHeader />
      <main>
        {sections.map((section) => renderSection(section, settings))}
      </main>
    </ThemeProvider>
  );
}
