import type { SiteTheme } from "@/lib/types";
import { themeToCssString } from "@/lib/theme-css";

export default function ThemeStyles({ theme }: { theme: SiteTheme }) {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root {\n  ${themeToCssString(theme)}\n}`,
      }}
    />
  );
}
