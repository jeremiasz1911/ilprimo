"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full border border-stone-700 px-4 py-2 text-sm tracking-[0.1em] text-stone-300 transition-colors hover:border-amber-400 hover:text-amber-400"
    >
      Wyloguj
    </button>
  );
}
