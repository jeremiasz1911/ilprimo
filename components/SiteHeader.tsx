import Header from "@/components/Header";
import {
  getNavigationLinks,
  getSiteSettings,
} from "@/lib/page-service";
import { getSiteTheme } from "@/lib/theme-service";

export const dynamic = "force-dynamic";

export default async function SiteHeader() {
  const [navLinks, settings, theme] = await Promise.all([
    getNavigationLinks(),
    getSiteSettings(),
    getSiteTheme(),
  ]);

  return (
    <Header
      navLinks={navLinks}
      logo={settings.logo}
      logoAlt={settings.restaurantName}
      mobileNavbarStyle={theme.mobileNavbarStyle}
    />
  );
}
