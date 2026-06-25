import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-white lg:flex">
      <AdminSidebar />
      <div className="flex-1">
        <div className="border-b border-stone-800 px-4 py-4 lg:hidden">
          <LogoutButton />
        </div>
        <main className="px-4 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
