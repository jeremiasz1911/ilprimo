"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { MobileNavbarStyle, NavLink } from "@/lib/types";
import { DEFAULT_LOGO } from "@/lib/constants";

interface HeaderProps {
  navLinks: NavLink[];
  logo: string;
  logoAlt: string;
  mobileNavbarStyle?: MobileNavbarStyle;
}

export default function Header({
  navLinks,
  logo,
  logoAlt,
  mobileNavbarStyle = "hamburger",
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = () => setIsOpen(false);
  const logoSrc = logo || DEFAULT_LOGO;
  const homeHref = navLinks.find((link) => link.href === "/")?.href ?? "/#hero";

  const linkClass =
    "text-[0.65rem] tracking-[0.15em] transition-colors duration-500 xl:text-xs xl:tracking-[0.2em]";
  const linkStyle = { color: "var(--theme-text)" };

  return (
    <header
      className={`theme-navbar fixed top-0 right-0 left-0 z-50 transition-all duration-700 ease-out ${
        scrolled
          ? "border-b shadow-lg backdrop-blur-md"
          : "backdrop-blur-sm"
      }`}
      style={{ borderColor: "var(--theme-border)" }}
    >
      <div
        className={`theme-container mx-auto flex items-center justify-between gap-3 px-4 transition-all duration-700 ease-out sm:px-6 lg:px-8 ${
          scrolled ? "h-14 sm:h-16" : "h-16 sm:h-20"
        }`}
      >
        <a href={homeHref} className="shrink-0">
          <div
            className={`relative transition-all duration-700 ${
              scrolled
                ? "h-10 w-36 sm:h-12 sm:w-40"
                : "h-12 w-40 sm:h-14 sm:w-48"
            }`}
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
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
              key={link.href + link.label}
              href={link.href}
              className={`${linkClass} hover:text-[var(--theme-accent)]`}
              style={linkStyle}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {mobileNavbarStyle !== "simple" && (
          <button
            type="button"
            className="flex shrink-0 flex-col gap-1.5 p-2 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isOpen}
          >
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
              style={{ backgroundColor: "var(--theme-text)" }}
            />
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
              style={{ backgroundColor: "var(--theme-text)" }}
            />
            <span
              className={`block h-0.5 w-6 transition-all duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
              style={{ backgroundColor: "var(--theme-text)" }}
            />
          </button>
        )}
      </div>

      {mobileNavbarStyle === "hamburger" && (
        <nav
          className={`theme-navbar overflow-hidden backdrop-blur-md transition-all duration-500 lg:hidden ${
            isOpen ? "max-h-72 border-t" : "max-h-0"
          }`}
          style={{ borderColor: "var(--theme-border)" }}
        >
          <div className="flex flex-col px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={handleNavClick}
                className="border-b py-3.5 text-sm tracking-[0.2em] transition-colors duration-500 hover:text-[var(--theme-accent)]"
                style={{
                  color: "var(--theme-text)",
                  borderColor: "var(--theme-border)",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      {mobileNavbarStyle === "bottom-sheet" && isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={handleNavClick}
            aria-label="Zamknij menu"
          />
          <nav
            className="theme-navbar fixed right-0 bottom-0 left-0 z-50 rounded-t-2xl border-t p-6 backdrop-blur-md lg:hidden"
            style={{ borderColor: "var(--theme-border)" }}
          >
            <div className="mb-4 h-1 w-12 rounded-full bg-stone-600 mx-auto" />
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  className="rounded-lg px-4 py-3 text-center text-sm tracking-[0.2em] transition-colors hover:text-[var(--theme-accent)]"
                  style={{ color: "var(--theme-text)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}

      {mobileNavbarStyle === "simple" && (
        <nav className="border-t lg:hidden" style={{ borderColor: "var(--theme-border)" }}>
          <div className="flex gap-1 overflow-x-auto px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="whitespace-nowrap px-3 py-2 text-[0.65rem] tracking-[0.12em] hover:text-[var(--theme-accent)]"
                style={{ color: "var(--theme-text)" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
