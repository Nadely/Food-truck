"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="absolute top-3 right-4 bg-red-600 text-white px-3 py-1.5 rounded-md border-2 border-black style-pen hover:bg-red-700"
    >
      Deconnexion
    </button>
  );
}

