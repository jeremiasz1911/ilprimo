"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteTheme } from "@/lib/types";
import { getDefaultTheme } from "@/lib/theme-presets";

const ThemeContext = createContext<SiteTheme>(getDefaultTheme());

export default function ThemeProvider({
  theme,
  children,
}: {
  theme: SiteTheme;
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useSiteTheme() {
  return useContext(ThemeContext);
}
