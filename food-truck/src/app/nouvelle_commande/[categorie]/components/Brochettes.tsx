"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const Brochettes = () => {
  const searchParams = useSearchParams();
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const isMenu = searchParams.get("menu") === "true"; // Retrieve 'menu' parameter
  const groupId = searchParams.get("groupId") || `brochette-${Date.now()}`;
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Brochettes.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedBrochette, setSelectedBrochette] = useState<number | null>(
    null
  );

  const handleIncrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] + 1,
      }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
      }));
    }
  };

  const handleSelectBrochette = (id: number) => {
    if (viaMitraillette) {
      setSelectedBrochette(id);
    }
  };

  const handleAddToCart = () => {
    if (viaMitraillette && selectedBrochette !== null) {
      const produit = data.Brochettes.find(
        (item) => item.id === selectedBrochette
      );
      if (produit) {
        const price = parseFloat(produit.price);
        addToCart({
          id: produit.id,
          name: produit.name,
          image: produit.image,
          price: price,
          quantity: 1,
          groupId: groupId,
          relatedItems: [{
            id: produit.id,
            name: produit.name,
            image: produit.image,
            price: price,
            quantity: 1,
            groupId: groupId,
            uniqueId: `brochette-${Date.now()}`
          }]
        });

        // Redirect to Sauces with viaBrochettes=true and groupId
        router.push(`Sauces?viaBrochettes=true&groupId=${groupId}${isMenu ? "&menu=true" : ""}`);
      }
    } else {
      const itemsToAdd = data.Brochettes.map((produit) => {
        const quantity = quantities[produit.id];
        if (quantity > 0) {
          return {
            id: produit.id,
            name: produit.name,
            image: produit.image,
            price: parseFloat(produit.price),
            quantity,
            groupId: `brochette-${Date.now()}`
          };
        }
        return null;
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach((item) => addToCart(item));

        // Determine the next route and append `menu=true` if needed
        let nextRoute = "/nouvelle_commande";
        if (isMenu) {
          nextRoute += nextRoute.includes("?") ? "&menu=true" : "?menu=true";
        }

        router.push(nextRoute);
      }
    }
  };

  return (
    <div className="text-black font-bold style-pen text-lg mb-5 mt-2">
      <div className="flex flex-col text-black items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Brochettes
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full max-w-[1200px]">
            {data.Brochettes.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-2 flex-grow basis-[140px] max-w-[160px] ${
                  viaMitraillette && selectedBrochette === product.id
                    ? "bg-green-200"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                  onClick={() => handleSelectBrochette(product.id)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1 text-center border-t border-black rounded-b-lg">
                    <p className="text-xs mt-auto mb-0.5">{product.name}</p>
                    {!viaMitraillette && (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          className="text-xs bg-red-500 focus:ring-2 rounded-lg px-1 py-0.5"
                          >
                          -
                        </button>
                        <span className="text-xs">{quantities[product.id]}</span>
                        <button
                          onClick={() => handleIncrement(product.id)}
                          className="text-xs bg-green-500 focus:ring-2 rounded-lg px-1 py-0.5"
                          >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                    {!viaMitraillette && (
                      <p className="text-xs text-white border border-white w-full text-center rounded-md mt-1 p-0.5">
                        {product.price}</p>
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

export default Brochettes;
