import type { SiteTheme } from "@/lib/types";

export function getButtonClassName(theme: SiteTheme, extra = ""): string {
  const styleMap: Record<SiteTheme["buttonStyle"], string> = {
    premium: "btn-premium",
    outline: "theme-btn theme-btn-outline",
    filled: "theme-btn theme-btn-filled",
    rounded: "theme-btn theme-btn-rounded",
    minimal: "theme-btn theme-btn-minimal",
  };

  return `inline-block ${styleMap[theme.buttonStyle] ?? "btn-premium"} ${extra}`.trim();
}
