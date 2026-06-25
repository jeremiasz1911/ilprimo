export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function splitHeroContent(content: string): {
  tagline: string;
  description: string;
} {
  const lines = content.split("\n").map((line) => line.trim());
  const [tagline, ...rest] = lines;
  return {
    tagline: tagline ?? "",
    description: rest.join(" ").trim(),
  };
}
