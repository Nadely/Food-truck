"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { dataProduits as data } from "../../../../data/db";
import { useCart } from "../../../context/CartContext";

const Frites = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viaSauces = searchParams.get("viaSauces") === "true";
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Frites.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );

  const handleIncrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(prevQuantities[id] - 1, 0),
    }));
  };

  const handleAddToCart = () => {
    const itemsToAdd = data.Frites.map((product) => {
      const quantity = quantities[product.id];
      if (quantity > 0) {
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          price: parseFloat(product.price),
          quantity,
        };
      }
      return null;
    }).filter(Boolean);

    if (itemsToAdd.length > 0) {
      const groupId = `frites-${Date.now()}`;
      itemsToAdd.forEach((item) => addToCart({...item, groupId}));

      // Ajouter les quantités de frites dans l'URL
      const fritesParams = Object.entries(quantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const frites = data.Frites.find(
            (product) => product.id === parseInt(id)
          );
          return frites ? `${frites.name}=${quantity}` : "";
        })
        .join("&");

      router.push(`Sauces?viaFrites=true&groupId=${groupId}&${fritesParams}`);
    } else {
      alert("Veuillez sélectionner une quantité avant de valider !");
    }
  };

  return (
    <div className="text-black font-bold style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col text-black items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Frites
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full max-w-[1400px]">
          {data.Frites.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center justify-center gap-2 flex-grow basis-[160px] max-w-[180px]"
            >
              <div
                className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                onClick={() => handleSelectFrites(product)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={product.image || "/frites.png"}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1 text-center border-t border-black rounded-b-lg">
                  <p className="text-sm mt-auto mb-0.5">{product.name}</p>
                  {!viaSauces && (
                    <div className="flex flex-row items-center justify-center gap-2">
                      <button
                        onClick={() => handleDecrement(product.id)}
                        className="text-sm bg-red-500 focus:ring-2 rounded-lg px-1.5 py-0.5"
                      >
                        -
                      </button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button
                        onClick={() => handleIncrement(product.id)}
                        className="text-sm bg-green-500 focus:ring-2 rounded-lg px-1.5 py-0.5"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!viaSauces && (
                <p className="text-sm text-white border border-white w-full text-center rounded-md mt-1 p-0.5">
                  {product.price}
                </p>
              )}
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
      </div>
    </div>
  );
};

export default Frites;
