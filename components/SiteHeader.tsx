import Header from "@/components/Header";
import {
  getNavigationLinks,
  getSiteSettings,
} from "@/lib/page-service";

export const revalidate = 60;

export default async function SiteHeader() {
  const [navLinks, settings] = await Promise.all([
    getNavigationLinks(),
    getSiteSettings(),
  ]);

  return (
    <Header
      navLinks={navLinks}
      logo={settings.logo}
      logoAlt={settings.restaurantName}
    />
  );
}
