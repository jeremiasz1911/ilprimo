import type { ReactNode } from "react";
import type { PageSection } from "@/lib/types";
import {
  getContentWidthClass,
  getSectionBackgroundStyle,
  getSectionPaddingClass,
  getSectionTextAlignClass,
  getSectionVisibilityClass,
} from "@/lib/section-layout";

interface SectionShellProps {
  section: PageSection;
  children: ReactNode;
  className?: string;
  as?: "section" | "footer";
}

export default function SectionShell({
  section,
  children,
  className = "",
  as: Tag = "section",
}: SectionShellProps) {
  return (
    <Tag
      id={section.id}
      className={`theme-section ${getSectionVisibilityClass(section)} ${getSectionPaddingClass(section)} ${getSectionTextAlignClass(section)} ${className}`}
      style={getSectionBackgroundStyle(section)}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${getContentWidthClass(section)}`}
      >
        {children}
      </div>
    </Tag>
  );
}
