"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "../../../../data/dataProduits.json";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

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

    if (isNaN(basePrice)) {
        console.error("Erreur de prix pour le produit", product.name);
        return;
    }

    const totalPrice = basePrice + menuPrice;
    const groupId = `mitraillette-${Date.now()}`;

    const item = {
      id: product.id,
      name:
        menus === true
          ? `Menu Mitraillette ${product.name}`
          : `Mitraillette ${product.name}`,
      image: product.image,
      price: totalPrice,
      quantity: 1,
      uniqueId: `${product.id}-${Date.now()}`,
      groupId: groupId,
      menuOption: menus,
      supplementPrice: menuPrice,
      viaMitraillette: true,
      relatedItems: [
        ...product.garniture.map((garniture: any) => ({
          ...garniture,
          isGarniture: true,
          parentId: product.id,
          groupId: groupId,
          uniqueId: `garniture-${Date.now()}`,
        })),
        ...(menus === true
          ? [
              {
                ...product.frites,
                isFrites: true,
                name: "Frites",
                image: "/frites.jpg",
                isFritesCategory: true,
                parentId: product.id,
                groupId: groupId,
                uniqueId: `frites-${Date.now()}`,
              },
            ]
          : []),
      ],
    };

    console.log("Ajout au panier avec groupId:", groupId);
    addToCart(item);

    // Redirection vers Sauces avec le groupId
    const url = `Sauces?viaMitraillette=true&groupId=${groupId}`;
    if (menus) {
      router.push(`${url}&menu=true`);
    } else {
      router.push(url);
    }
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Mitraillettes
      </div>
      <div className="w-full flex flex-row items-center justify-center mt-10 style-pen text-lg gap-4 mb-5">
        {data.Mitraillettes.map((product) => {
          const price = parseFloat(product.price);
          const totalPrice = menus ? price + 2.5 : price;

          return (
            <div key={product.id} className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleProduitClick(product)}
                className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                style={{ width: "200px", height: "200px" }}
              >
                <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                  <p>{product.name}</p>
                </div>
              </button>

              <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-auto">
                {totalPrice.toFixed(2)} €
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center text-white justify-center mt-10 gap-4">
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
          * Cela inclus des frites (2.5€ au prix indique).
        </div>
      </div>
    </div>
  );
};

export default Mitraillettes;
