import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import DishDetail from "@/components/DishDetail";
import { getPublicDishBySlug } from "@/lib/menu-service";

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

  return (
    <>
      <SiteHeader />
      <main>
        <DishDetail item={item} />
      </main>
    </>
  );
}
