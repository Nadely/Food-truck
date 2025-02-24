"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "@/data/dataProduits.json";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const Mitraillettes = () => {
  const [menus, setMenus] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

  const handleProduitClick = async (product: any) => {
    const menuPrice = menus ? 2.5 : 0;

    // Nettoyer et convertir le prix
    const cleanedPrice = product.price.replace("€", "").replace(",", ".").trim();
    const basePrice = parseFloat(cleanedPrice);

    console.log("Prix brut:", product.price); // Log du prix brut
    console.log("Prix nettoyé:", cleanedPrice); // Log du prix nettoyé
    console.log("Prix de base:", basePrice); // Log du prix de base

    if (isNaN(basePrice)) {
        console.error("Erreur de prix pour le produit", product.name);
        return;
    }

    const totalPrice = basePrice + menuPrice;

    const item = {
      id: product.id,
      name:
        menus === true
          ? `Menu Mitraillette ${product.name}`
          : `Mitraillette ${product.name}`,
      price: totalPrice,
      quantity: 1,
      uniqueId: `${product.id}-${Date.now()}`,
      menuOption: menus,
      supplementPrice: menuPrice,
      viaMitraillette: true,
      relatedItems: [
        ...product.garniture.map((garniture: any) => ({
          ...garniture,
          isGarniture: true,
          parentId: product.id,
        })),
        ...(menus === true
          ? [
              {
                ...product.frites,
                isFrites: true,
                name: "Frites",
                isFritesCategory: true,
                parentId: product.id,
              },
            ]
          : []),
      ],
    };

    addToCart(item);

    const route =
      product.id === 1
        ? "Snacks"
        : product.id === 2
        ? "Sauces"
        : product.id === 3
        ? "Brochettes"
        : "";

    if (route) {
      const url = `/nouvelle_commande/${route}?viaMitraillette=true`;

      if (menus === true) {
        router.push(`${url}&menu=true`);
      } else {
        router.push(url);
      }
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };


  //   try {
  //     const response = await fetch("/api/panier", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         id: Date.now(),
  //         image: "/images/default.jpg",
  //         items: [item],
  //         user_name: "User",
  //         user_image: "/avatar.jpg",
  //         time: new Date().toLocaleTimeString(),
  //         date: new Date().toISOString(),
  //         lieu: "Lieu de commande",
  //       }),
  //     });

  //     if (!response.ok) {
  //       const errorMessage = await response.text();
  //       throw new Error(errorMessage || "Erreur lors de l'enregistrement du panier");
  //     }

  //     const data = await response.json();
  //     console.log("Panier mis à jour :", data);
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout au panier :", error);
  //   }
  // };

  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">
        Mitraillettes
      </h1>
      <div className="w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
        {data.Mitraillettes.map((product) => {
          const price = parseFloat(product.price);
          const totalPrice = menus ? price + 2.5 : price;

          return (
            <button
              key={product.id}
              onClick={() => handleProduitClick(product)}
              className="flex flex-col items-center justify-center gap-4 border-2 border-black rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
              style={{ width: "200px", height: "200px" }}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="object-contain"
              />
              <span>{product.name}</span>
              <span>{totalPrice.toFixed(2)}€</span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <label className="flex items-center gap-2 text-lg">
          Option Menu ?*
          <input
            type="checkbox"
            style={{ transform: "scale(1.5)" }}
            checked={menus}
            onChange={handleCheckboxChange}
          />
        </label>
        <div className="flex flex-col items-center justify-center mt-2 gap-4 text-sm">
          *Cela inclus des frites supplémentaires + 2.5€ au prix indiqué.
        </div>
      </div>
    </div>
  );
};

export default Mitraillettes;
