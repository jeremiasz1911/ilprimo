import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import DishDetail from "@/components/DishDetail";
import { getPublicDishBySlug } from "@/lib/menu-service";
import { decodeSlugParam, slugify } from "@/lib/slugify";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPublicDishBySlug(slug);

  if (!item) {
    return { title: "Nie znaleziono | IL PRIMO" };
  }

  return {
    title: `${item.name} | IL PRIMO`,
    description: item.shortDescription,
  };
}

export default async function DishPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublicDishBySlug(slug);

  if (!item) {
    notFound();
  }

  const canonicalSlug = slugify(item.slug);
  const requestedSlug = decodeSlugParam(slug);

  if (canonicalSlug && requestedSlug !== canonicalSlug && slug !== canonicalSlug) {
    redirect(`/menu/${canonicalSlug}`);
  }

  return (
    <>
      <SiteHeader />
      <main>
        <DishDetail item={item} />
      </main>
    </>
  );
}
