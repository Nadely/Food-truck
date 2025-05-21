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

  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);

  const ID_NONE = 10;


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

    const relatedItems = data.Supplements.filter((product) =>
      selectedSupplements.includes(product.id)
    ).map((product) => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: 0, // Tous les suppléments sont affichés comme gratuits
      quantity: 1,
      uniqueId: `supplement-${product.id}-${Date.now()}`,
    }));

    // Calcul du prix : on compte tous sauf "Aucun supplément"
    const supplementsPrice = hasNoSupplement
      ? selectedSupplements.length === 1
        ? 0
        : relatedItems.filter((item) => item.id !== ID_NONE).length
      : relatedItems.length;

    const item = {
      id: `supplements-${Date.now()}`,
      image: "/supplements.png",
      price: supplementsPrice,
      quantity: 1,
      uniqueId: `supplements-${Date.now()}`,
      relatedItems,
    };

    addToCart(item);

    let nextRoute = "Boissons?viaSupplements=true";
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
