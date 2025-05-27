"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import data from "../../../../data/dataProduits.json";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";

const Mitraillettes = () => {
  const [menus, setMenus] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viaSauces = searchParams.get("viaSauces") === "true";

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

    // Redirection selon le type de mitraillette
    let url = "";
    if (product.name === "Classique") {
      url = `Snacks?viaMitraillette=true&groupId=${groupId}`;
    } else if (product.name === "Brochette") {
      url = `Brochettes?viaMitraillette=true&groupId=${groupId}`;
    } else {
      url = `Sauces?viaMitraillette=true&groupId=${groupId}`;
    }

    if (menus) {
      router.push(`${url}&menu=true`);
    } else {
      router.push(`${url}`);
    }
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Mitraillettes
      </div>
      <div className="w-full flex flex-row flex-wrap items-center justify-center mt-10 style-pen text-lg gap-4 mb-5">
        {data.Mitraillettes.map((product) => {
          const basePrice = parseFloat(product.price);
          const menuPrice = menus ? 2.5 : 0;
          const totalPrice = basePrice + menuPrice;

          return (
            <div
              key={product.id}
              className="flex flex-col items-center justify-center gap-2 flex-grow basis-[200px] max-w-[240px]"
            >
              <div
                className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1.5 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                onClick={() => handleProduitClick(product)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1.5 text-center border-t border-black rounded-b-lg">
                  <p className="text-base mt-auto mb-0.5">{product.name}</p>
                </div>
              </div>
              {!viaSauces && (
                <p className="text-base text-white border border-white w-full text-center rounded-md mt-1.5 p-1">
                  {product.price}
                </p>
              )}
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
