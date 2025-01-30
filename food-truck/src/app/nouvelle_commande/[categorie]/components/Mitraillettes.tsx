"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "@/data/dataProduits.json";
import { useState } from "react";

const Mitraillettes = () => {
  const [menus, setMenus] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

<<<<<<< HEAD
  const handleProduitClick = (product: any) => {
=======
  const handleProduitClick = async (product: any) => {
    const menuPrice = menus ? 2.5 : 0;
    const item = {
      id: product.id,
      name:
        menus === true
          ? ` Menue Mitraillette ${product.name}`
          : `Mitraillette ${product.name}`,
      price: parseFloat(product.price) + menuPrice,
      quantity: 1,
      uniqueId: `${product.id}-${Date.now()}`, // Identifiant unique pour chaque article
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

>>>>>>> panierNad2
    const route =
      product.id === 1
        ? "Snacks"
        : product.id === 2
        ? "Sauces"
        : product.id === 3
        ? "Brochettes"
        : "";

    if (route) {
<<<<<<< HEAD
      router.push(`/nouvelle_commande/${route}?viaMitraillette=true`);
=======
      // Si le produit a une route valide, construire l'URL
      const url = `/nouvelle_commande/${route}?viaMitraillette=true`;

      // Ajouter l'option menu si nécessaire
      if (menus === true) {
        router.push(`${url}&menu=true`);
      } else {
        router.push(url);
      }
>>>>>>> panierNad2
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };
<<<<<<< HEAD
=======

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
>>>>>>> panierNad2

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
