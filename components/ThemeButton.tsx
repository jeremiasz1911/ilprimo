"use client";

import type { SiteTheme } from "@/lib/types";
import { getButtonClassName } from "@/lib/theme-button";
import { useSiteTheme } from "@/components/ThemeProvider";

interface ThemeButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  theme?: SiteTheme;
}

export default function ThemeButton({
  href,
  children,
  className = "",
  theme: themeProp,
}: ThemeButtonProps) {
  const contextTheme = useSiteTheme();
  const theme = themeProp ?? contextTheme;

  return (
    <a href={href} className={getButtonClassName(theme, className)}>
      {children}
    </a>
  );
}
