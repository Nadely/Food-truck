"use client";

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategorieNav from "./components/CategorieNav";
import Nav from "./components/Nav";
import Panier from "./components/Panier";
import Horaires from "./(categories)/horaires/page";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";
import StockAlerts from "./components/StockAlerts";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Pages sans layout admin
  const isAuthPage = pathname === "/" || pathname === "/reset-password";

  return (
    <html lang="fr">
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <CartProvider>
            {isAuthPage ? (
              // Affichage épuré pour /login et /reset-password
              <main className="flex-grow flex items-center justify-center bg-gray-900">
                {children}
              </main>
            ) : (
              <>
                <header>
                  <Header />
                </header>

                <div className="flex flex-row mt-2">
                  <aside className="flex flex-col items-center left-0 w-[200px] mt-20 mb-2">
                    <CategorieNav />
                  </aside>

                  <main className="flex-grow">
                    <Nav />
                    <StockAlerts />

                    {/* Section pour children et Panier */}
                    <div className="flex mt-2 gap-4 font-bold style-pen">
                      {/* children : 2/3 */}
                      {pathname && pathname.startsWith("/nouvelle_commande") ? (
                        <div className="flex-[2] w-3/4 p-2">{children}</div>
                      ) : pathname && pathname.startsWith("/panier") ? (
                        // Si le chemin est /panier, on rend le composant Panier comme un enfant
                        <div className="flex-[2] w-3/4 p-2">
                          <Panier />
                        </div>
                      ) : pathname && pathname.startsWith("/horaires") ? (
                        <div className="flex-[2] w-full p-2">
                          <Horaires />
                        </div>
                      ) : (
                        <div className="flex-[2] w-full p-2">
                          {children}
                        </div>
                      )}

                      {/* Panier : 1/3 */}
                      {(pathname && pathname.startsWith("/nouvelle_commande")) ||
                      (pathname && pathname.startsWith("/horaires")) ? (
                        <div className="flex-[1] w-1/4 bg-white opacity-80 rounded-md p-2">
                          <Panier />
                        </div>
                      ) : null}
                    </div>
                  </main>
                </div>

                <footer className="mt-auto">
                  <Footer />
                </footer>
              </>
            )}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
