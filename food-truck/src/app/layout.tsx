"use client";

import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CategorieNav from "./components/CategorieNav";
import Nav from "./components/Nav";
import Panier from "./components/Panier";
import Horaires from "./components/Horaires";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/app/context/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <CartProvider>
      <html lang="fr">
        <body className="flex flex-col min-h-screen">
          <header>
            <Header />
          </header>

          <div className="flex flex-row mt-2">
            <aside className="flex flex-col items-center left-0 w-[200px] mt-20 mb-2">
              <CategorieNav />
            </aside>

            <main className="flex-grow">
              <Nav />

              {/* Section pour children et Panier */}
              <div className="flex mt-2 gap-4 font-bold font-serif">
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
                {pathname && pathname.startsWith("/nouvelle_commande") && (
                  <div className="flex-[1] w-1/4 bg-gray-200 rounded-md p-2">
                    <Panier />
                  </div>
                )}
              </div>
            </main>
          </div>

          <footer className="mt-auto">
            <Footer />
          </footer>
        </body>
      </html>
    </CartProvider>
  );
}
