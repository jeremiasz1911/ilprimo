"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { localImages } from "@/data/menu";

const navLinks = [
  { href: "/#hero", label: "STRONA GŁÓWNA" },
  { href: "/#o-nas", label: "O NAS" },
  { href: "/#menu", label: "MENU" },
  { href: "/#kontakt", label: "KONTAKT" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "border-b border-white/5 bg-black/75 shadow-lg backdrop-blur-md"
          : "bg-black/90 backdrop-blur-sm"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-all duration-700 ease-out sm:px-6 lg:px-8 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        <a href="/#hero" className="shrink-0">
          <div
            className={`relative transition-all duration-700 ${
              scrolled
                ? "h-10 w-36 sm:h-12 sm:w-40"
                : "h-12 w-40 sm:h-14 sm:w-48"
            }`}
          >
            <Image
              src={localImages.logo}
              alt="IL PRIMO Ristorante Italiano"
              fill
              sizes="(max-width: 640px) 160px, 192px"
              className="object-contain object-center"
              priority
            />
          </div>
        </a>

        <nav className="hidden items-center gap-4 lg:flex lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.65rem] tracking-[0.15em] text-white/90 transition-colors duration-500 hover:text-amber-400 xl:text-xs xl:tracking-[0.2em]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="flex shrink-0 flex-col gap-1.5 p-2 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={isOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <nav
        className={`overflow-hidden bg-black/95 backdrop-blur-md transition-all duration-500 lg:hidden ${
          isOpen ? "max-h-72 border-t border-white/10" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="border-b border-white/5 py-3.5 text-sm tracking-[0.2em] text-white/90 transition-colors duration-500 hover:text-amber-400"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
