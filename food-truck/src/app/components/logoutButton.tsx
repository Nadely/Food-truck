"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold hover:bg-red-700 transition"
    >
      Déconnexion
    </button>
  );
}
