"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const isAdmin = session?.user?.role === "ADMIN";
  const isClient = session?.user?.role === "CLIENT";

  return (
    <div className="relative w-screen h-[120px] overflow-hidden">

      {/* ========================================= */}
      {/* DRAPEAU */}
      {/* ========================================= */}

      <Image
        src="/drapeau.jpg"
        alt="Drapeau"
        fill
        priority
        className="object-cover"
      />


      {/* ========================================= */}
      {/* TITRE DYNAMIQUE */}
      {/* ========================================= */}

      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl style-pen">

        La petite Belgique des coevrons

        {isAdmin && " - Admin"}

        {isClient && ""}

      </div>


      {/* ========================================= */}
      {/* LOGO */}
      {/* ========================================= */}

      <Image
        src="/Micka.png"
        alt="Logo"
        width={80}
        height={70}
        className="absolute top-0 left-5"
      />


      {/* ========================================= */}
      {/* BOUTON DÉCONNEXION */}
      {/* ========================================= */}

      {session && (

        <div className="absolute top-4 right-5 z-10">

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-white font-semibold shadow-md hover:bg-red-700 transition"
          >
            Déconnexion
          </button>

        </div>

      )}

    </div>
  );
};

export default Header;
