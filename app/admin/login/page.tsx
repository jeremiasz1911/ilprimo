import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata = {
  title: "Logowanie | IL PRIMO CMS",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md border border-stone-800 bg-black p-8">
        <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">
          IL PRIMO
        </p>
        <h1 className="mt-2 font-serif text-3xl text-white">Panel CMS</h1>
        <p className="mt-3 text-sm text-stone-400">
          Zaloguj się, aby zarządzać menu restauracji.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
