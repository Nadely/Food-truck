"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useCart } from "../../../context/CartContext";

const Supplements = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viaSauces = searchParams.get("viaSauces") === "true";
  const viaBurgers = searchParams.get("viaBurgers") === "true";
  const { addToCart } = useCart();
  const groupId = searchParams.get("groupId");

  if (!groupId) {
    console.error("groupId manquant dans les paramètres d'URL");
    router.push("/nouvelle_commande");
    return null;
  }

  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);

  const ID_NONE = 10;

  // Produit principal (exemple)
  const mainProduct = {
    id: 1, // Remplace par l'ID du produit principal
    name: "Produit Principal",
    price: "10.00", // Prix du produit principal
  };

  const handleSelectSupplements = (id: number) => {
    setSelectedSupplements((prevSelected) => {
      if (id === ID_NONE) {
        return prevSelected.includes(ID_NONE) ? [] : [ID_NONE];
      }

      if (prevSelected.includes(ID_NONE)) {
        return [id];
      }

      return prevSelected.includes(id)
        ? prevSelected.filter((supplementsId) => supplementsId !== id)
        : [...prevSelected, id];
    });
  };

  const handleAddToCart = () => {
    const hasNoSupplement = selectedSupplements.includes(ID_NONE);

    // Trouver l'item "Aucuns supplements" dans les données
    const noSupplementItem = data.Supplements.find(product => product.id === ID_NONE);

    if (hasNoSupplement) {
      const item = {
        id: Date.now(),
        name: "",
        image: "/supplements.png",
        price: 0,
        quantity: 1,
        uniqueId: `supplements-${Date.now()}`,
        isSupplements: true,
        relatedItems: [{
          id: ID_NONE,
          name: noSupplementItem?.name || "Aucuns supplements",
          image: noSupplementItem?.image || "/rien.png",
          price: 0,
          quantity: 1,
          uniqueId: `supplement-${ID_NONE}-${Date.now()}`,
          isSupplements: false,
          isNoSupplement: true,
          groupId: groupId
        }],
        groupId: groupId
      };
      addToCart(item);
    } else {
      const relatedItems = data.Supplements.filter((product) =>
        selectedSupplements.includes(product.id)
      ).map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
        price: 1, // Prix fixe de 1€ par supplément
        quantity: 1,
        uniqueId: `supplement-${product.id}-${Date.now()}`,
        isSupplements: true,
        groupId: groupId
      }));

      const supplementsPrice = relatedItems.length; // 1€ par supplément

      const item = {
        id: Date.now(),
        name: "",
        image: "/supplements.png",
        price: supplementsPrice,
        quantity: 1,
        uniqueId: `supplements-${Date.now()}`,
        isSupplements: true,
        relatedItems,
        groupId: groupId
      };

      addToCart(item);
    }

    let nextRoute = `Boissons?viaSupplements=true&groupId=${groupId}`;
    if (searchParams.get("menu") === "true") {
      nextRoute += "&menu=true";
    }

    router.push(nextRoute);
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Supplements *
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.Supplements.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedSupplements.includes(product.id)
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSupplements(product.id)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <p className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg text-sm">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
        <p className="text-center text-white text-sm">* 1€ par supplements</p>
      </div>
    </div>
  );
};

export default Supplements;
