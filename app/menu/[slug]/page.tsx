import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DishDetail from "@/components/DishDetail";
import { getAllMenuSlugs, getMenuItemBySlug } from "@/data/menu";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllMenuSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getMenuItemBySlug(slug);

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
  const item = getMenuItemBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <DishDetail item={item} />
      </main>
    </>
  );
}
