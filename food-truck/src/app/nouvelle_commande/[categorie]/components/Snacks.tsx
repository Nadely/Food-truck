"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const Snacks = () => {
  const searchParams = useSearchParams();
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const isMenu = searchParams.get("menu") === "true";
  const groupId = searchParams.get("groupId") || `snack-${Date.now()}`;
  const router = useRouter();
  const { addToCart, addRelatedItem } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Snacks.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnack, setSelectedSnack] = useState<number | null>(null);

  const handleIncrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
    }
  };

  const handleSelectSnack = (product: any) => {
    setSelectedSnack(product.id);
  };

  const handleAddToCart = () => {
    if (viaMitraillette && selectedSnack !== null) {
      const produit = data.Snacks.find((item) => item.id === selectedSnack);
      if (produit) {
        let cleanPrice = viaMitraillette && produit.categorie === "Snacks"
          ? 0
          : parseFloat(produit.price.replace(/[^\d,.]/g, "").replace(",", "."));

        if (isNaN(cleanPrice)) {
          console.error("Prix invalide, affectation à 0");
          cleanPrice = 0;
        }

        addToCart({
          id: Date.now(),
          quantity: 1,
          groupId: groupId,
          isHidden: true,
          relatedItems: [{
            id: produit.id,
            name: produit.name,
            image: produit.image,
            price: cleanPrice,
            quantity: 1,
            groupId: groupId,
            isSnack: true,
            viaMitraillette: true
          }]
        });

        router.push(`Sauces?viaSnacks=true&groupId=${groupId}${isMenu ? "&menu=true" : ""}`);
      }
    } else {
      const itemsToAdd = data.Snacks.map((produit) => {
        const quantity = quantities[produit.id];
        if (quantity > 0) {
          let cleanPrice = viaMitraillette
            ? 0
            : parseFloat(produit.price.replace(/[^\d,.]/g, "").replace(",", "."));

          if (isNaN(cleanPrice)) {
            console.error(`Prix invalide pour ${produit.name}, valeur forcée à 0`);
            cleanPrice = 0;
          }

          return {
            id: produit.id,
            name: produit.name,
            image: produit.image,
            price: cleanPrice,
            quantity,
            groupId: `snack-${Date.now()}`
          };
        }
        return null;
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach((item) => addToCart(item));
        router.push(`/nouvelle_commande${isMenu ? "?menu=true" : ""}`);
      }
    }
  };

  return (
    <div className="text-black style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col text-black items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Snacks
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-xl mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            {data.Snacks.filter(
              (product) => viaMitraillette || product.name !== "Steack haché"
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center flex-grow basis-[140px] max-w-[160px] ${
                  viaMitraillette && selectedSnack === product.id
                    ? "bg-green-200 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                  onClick={() => handleSelectSnack(product)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1 text-center border-t border-black rounded-b-lg flex flex-col items-center">
                    <p className="text-xs">{product.name}</p>

                    {!viaMitraillette && (
                      <div className="flex flex-row items-center justify-center gap-2 mt-1">
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

export default Snacks;
