"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "@/data/dataProduits.json";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const Burgers = () => {
  const [menus, setMenus] = useState(false);
  const [garnitures, setGarnitures] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const handleCheckboxChangeMenus = () => setMenus(!menus);
  const handleCheckboxChangeGarnitures = () => setGarnitures(!garnitures);

  const handleProduitClick = (product: any) => {
    const menuPrice = menus ? 2.5 : 0;
    const garniturePrice = garnitures ? 3 : 0;

    const item = {
      id: product.id,
      name: menus === true ? `Menu ${product.name}` : `${product.name}`,
      image: product.image,
      price: parseFloat(product.price) + menuPrice + garniturePrice,
      quantity: 1,
      uniqueId: `${product.id}-${Date.now()}`,
      menuOption: menus,
      garnitureOption: garnitures,
      supplementPrice: menuPrice + garniturePrice,
      viaMitraillette: true,
      relatedItems: [
        ...product.garniture.map((garniture: any) => ({
          ...garniture,
          isGarniture: true,
          parentId: product.id,
        })),
        ...(garnitures // Vérifie si "Double Garniture" est activé
          ? [
              {
                isGarniture: true,
                name: "Double Garniture", // Indique que l'option double garniture est activée
                parentId: product.id,
              },
            ]
          : []),
        ...(menus === true
          ? [
              {
                ...product.frites,
                isFrites: true,
                name: "Frites",
                image: product.frites.image,
                isFritesCategory: true,
                parentId: product.id,
              },
            ]
          : []),
      ],
    };

    addToCart(item);

    const validIds = [1, 2, 3, 4, 5, 6];
    const route = validIds.includes(product.id) ? "Supplements" : null;

    if (route) {
      // Si le produit a une route valide, construire l'URL
      const url = `/nouvelle_commande/${route}?viaBurgers=true`;

      // Ajouter l'option menu si nécessaire
      if (menus === true) {
        router.push(`${url}&menu=true`);
      } else {
        router.push(url);
      }
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Burgers</h1>
      <div className="w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
        {data.Burgers.map((product) => {
          const price = parseFloat(product.price);
          const menuPrice = menus ? 2.5 : 0;
          const garniturePrice = garnitures ? 3 : 0;
          const totalPrice = price + menuPrice + garniturePrice;

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
              />
              <span>{product.name}</span>
              <span>{totalPrice.toFixed(2)} €</span>
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
            onChange={handleCheckboxChangeMenus}
          />
        </label>
        <label className="flex items-center gap-2 text-lg">
          Option double garniture ?**
          <input
            type="checkbox"
            style={{ transform: "scale(1.5)" }}
            checked={garnitures}
            onChange={handleCheckboxChangeGarnitures}
          />
        </label>
        <div className="flex flex-col items-center justify-center mt-2 gap-4 text-sm">
          *Cela inclut des frites supplémentaires (+ 2.5€ au prix indiqué).
        </div>
        <div className="flex flex-col items-center justify-center mt-2 gap-4 text-sm">
          **Uniquement pour le burger (+ 3€ au prix indiqué).
        </div>
      </div>
    </div>
  );
};

export default Burgers;
