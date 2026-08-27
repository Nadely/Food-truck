"use client";

import "./globals.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CategorieNav from "./components/CategorieNav";
import Nav from "./components/Nav";
import Panier from "./components/Panier";
import Horaires from "./(categories)/horaires/page";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { CartProvider } from "./context/CartContext";
import StockAlerts from "./components/StockAlerts";

import {
  SessionProvider,
  useSession,
} from "next-auth/react";


// =====================================================
// CONTENU DU LAYOUT
// =====================================================

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();


  // ===================================================
  // PAGES AUTHENTIFICATION
  // ===================================================

  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/reset-password";


  // ===================================================
  // RÔLE UTILISATEUR
  // ===================================================

  const role = session?.user?.role;

  const isClient = role === "CLIENT";
  const isAdmin = role === "ADMIN";


  // ===================================================
  // PROTECTION CLIENT
  // ===================================================

  useEffect(() => {

    if (status === "loading") {
      return;
    }

    if (!isClient) {
      return;
    }

    // Pages accessibles au client
    const clientAllowedPaths = [
      "/nouvelle_commande",
      "/panier",
      "/horaires",
    ];

    const isAllowed = clientAllowedPaths.some(
      (path) =>
        pathname === path ||
        pathname.startsWith(`${path}/`)
    );

    // Toute autre page retourne vers nouvelle_commande
    if (!isAllowed) {
      router.replace("/nouvelle_commande");
    }

  }, [
    status,
    isClient,
    pathname,
    router,
  ]);


  // ===================================================
  // PAGE DE CONNEXION
  // ===================================================

  if (isAuthPage) {

    return (
      <main className="flex-grow flex items-center justify-center bg-gray-900">
        {children}
      </main>
    );

  }


  // ===================================================
  // CHARGEMENT
  // ===================================================

  if (status === "loading") {

    return (
      <main className="flex-grow flex items-center justify-center">
        <p>Chargement...</p>
      </main>
    );

  }


  // ===================================================
  // INTERFACE CLIENT
  // ===================================================

  if (isClient) {

    return (
      <>

        {/* ========================================= */}
        {/* HEADER CLIENT */}
        {/* ========================================= */}

        <header>
          <Header />
        </header>


        {/* ========================================= */}
        {/* CONTENU CLIENT */}
        {/* ========================================= */}

        <main className="flex-grow">

          {/* ======================================= */}
          {/* NOUVELLE COMMANDE + PANIER */}
          {/* ======================================= */}

          {pathname.startsWith("/nouvelle_commande") && (

            <div className="flex mt-2 gap-4 font-bold style-pen">

              {/* NOUVELLE COMMANDE */}

              <div className="flex-[2] w-3/4 p-2">

                {children}

              </div>


              {/* PANIER CLIENT */}

              <div className="flex-[1] w-1/4 bg-white opacity-80 rounded-md p-2">

                <Panier />

              </div>

            </div>

          )}


          {/* ======================================= */}
          {/* PAGE HORAIRES CLIENT */}
          {/* ======================================= */}

          {pathname.startsWith("/horaires") && (

            <div className="flex mt-2 gap-4 font-bold style-pen">

              {/* HORAIRES */}

              <div className="flex-[2] w-3/4 p-2">

                <Horaires />

              </div>


              {/* PANIER */}

              <div className="flex-[1] w-1/4 bg-white opacity-80 rounded-md p-2">

                <Panier />

              </div>

            </div>

          )}


          {/* ======================================= */}
          {/* PAGE PANIER */}
          {/* ======================================= */}

          {pathname.startsWith("/panier") && (

            <div className="w-full p-4">

              <Panier />

            </div>

          )}

        </main>


        {/* ========================================= */}
        {/* FOOTER CLIENT */}
        {/* ========================================= */}

        <footer className="mt-auto">

          <Footer />

        </footer>

      </>
    );

  }


  // ===================================================
  // INTERFACE ADMIN
  // ===================================================

  if (isAdmin) {

    return (
      <>

        {/* ========================================= */}
        {/* HEADER ADMIN */}
        {/* ========================================= */}

        <header>
          <Header />
        </header>


        {/* ========================================= */}
        {/* CORPS ADMIN */}
        {/* ========================================= */}

        <div className="flex flex-row mt-2">


          {/* ======================================= */}
          {/* MENU GAUCHE ADMIN */}
          {/* ======================================= */}

          <aside className="flex flex-col items-center left-0 w-[200px] mt-20 mb-2">

            <CategorieNav />

          </aside>


          {/* ======================================= */}
          {/* CONTENU ADMIN */}
          {/* ======================================= */}

          <main className="flex-grow">

            {/* NAVIGATION ADMIN */}

            <Nav />


            {/* ALERTES STOCK */}

            <StockAlerts />


            {/* CONTENU + PANIER */}

            <div className="flex mt-2 gap-4 font-bold style-pen">


              {/* ================================= */}
              {/* CONTENU PRINCIPAL */}
              {/* ================================= */}

              {pathname.startsWith("/nouvelle_commande") ? (

                <div className="flex-[2] w-3/4 p-2">

                  {children}

                </div>

              ) : pathname.startsWith("/panier") ? (

                <div className="flex-[2] w-3/4 p-2">

                  <Panier />

                </div>

              ) : pathname.startsWith("/horaires") ? (

                <div className="flex-[2] w-full p-2">

                  <Horaires />

                </div>

              ) : (

                <div className="flex-[2] w-full p-2">

                  {children}

                </div>

              )}


              {/* ================================= */}
              {/* PANIER À DROITE */}
              {/* ================================= */}

              {(
                pathname.startsWith("/nouvelle_commande") ||
                pathname.startsWith("/horaires")
              ) && (

                <div className="flex-[1] w-1/4 bg-white opacity-80 rounded-md p-2">

                  <Panier />

                </div>

              )}

            </div>

          </main>

        </div>


        {/* ========================================= */}
        {/* FOOTER ADMIN */}
        {/* ========================================= */}

        <footer className="mt-auto">

          <Footer />

        </footer>

      </>
    );

  }


  // ===================================================
  // UTILISATEUR NON CONNECTÉ
  // ===================================================

  return (

    <main className="flex-grow flex items-center justify-center">

      {children}

    </main>

  );

}


// =====================================================
// ROOT LAYOUT
// =====================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="fr">

      <body className="flex flex-col min-h-screen">

        <SessionProvider>

          <CartProvider>

            <LayoutContent>
              {children}
            </LayoutContent>

          </CartProvider>

        </SessionProvider>

      </body>

    </html>

  );

}
