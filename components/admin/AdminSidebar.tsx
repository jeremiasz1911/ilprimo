"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "START" },
  { href: "/admin/sections", label: "SEKCJE STRONY" },
  { href: "/admin/appearance", label: "WYGLĄD STRONY" },
  { href: "/admin/categories", label: "KATEGORIE MENU" },
  { href: "/admin/dishes", label: "DANIA" },
  { href: "/admin/settings", label: "USTAWIENIA" },
  { href: "/admin/backup", label: "BACKUP" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-stone-800 bg-black lg:min-h-screen lg:w-64 lg:border-r lg:border-b-0">
      <div className="border-b border-stone-800 px-6 py-5">
        <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">
          IL PRIMO
        </p>
        <h1 className="mt-1 font-serif text-xl text-white">Panel CMS</h1>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-4 py-4 lg:flex-col lg:gap-0 lg:px-0 lg:py-6">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-4 py-3 text-sm tracking-[0.15em] transition-colors lg:px-6 ${
                active
                  ? "bg-amber-400/10 text-amber-400"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-stone-800 p-6 lg:block">
        <LogoutButton />
      </div>
    </aside>
  );
}
