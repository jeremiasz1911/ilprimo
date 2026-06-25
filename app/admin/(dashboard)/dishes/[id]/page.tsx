import Link from "next/link";
import { notFound } from "next/navigation";
import DishForm from "@/components/admin/DishForm";
import { getAllCategories, getDishById } from "@/lib/menu-service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDishPage({ params }: PageProps) {
  const { id } = await params;
  const [dish, categories] = await Promise.all([
    getDishById(id),
    getAllCategories(),
  ]);

  if (!dish) notFound();

  return (
    <div>
      <Link
        href="/admin/dishes"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do dań
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Edytuj danie</h2>
      <div className="mt-8 max-w-3xl">
        <DishForm categories={categories} initial={dish} />
      </div>
    </div>
  );
}
