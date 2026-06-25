import Link from "next/link";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/categories"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do kategorii
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Dodaj kategorię</h2>
      <div className="mt-8 max-w-xl">
        <CategoryForm />
      </div>
    </div>
  );
}
