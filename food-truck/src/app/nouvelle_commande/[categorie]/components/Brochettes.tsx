"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const Brochettes = () => {
  const searchParams = useSearchParams();
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const isMenu = searchParams.get("menu") === "true";  // Retrieve 'menu' parameter
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Brochettes.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedBrochette, setSelectedBrochette] = useState<number | null>(null);

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
      const produit = data.Brochettes.find(item => item.id === selectedBrochette);
      if (produit) {
        addToCart({
          relatedItems: [{ id: produit.id, name: produit.name }],
        });

        // Redirect to Sauces with viaBrochettes=true
        router.push("Sauces?viaBrochettes=true" + (isMenu ? "&menu=true" : ""));
      }
    } else {
      const itemsToAdd = data.Brochettes
        .map(produit => {
          const quantity = quantities[produit.id];
          if (quantity > 0) {
            return {
              id: produit.id,
              name: produit.name,
              price: parseFloat(produit.price),
              quantity,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach(item => addToCart(item));

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
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Brochettes</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.Brochettes.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  viaMitraillette && selectedBrochette === product.id
                    ? "bg-green-200"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectBrochette(product.id)}
                >
                  <Image src={product.image} alt={product.name} width={90} height={90} />
                  <p className="text-sm mt-auto mb-1">{product.name}</p>
                  {!viaMitraillette && <p className="text-sm mt-auto">{product.price}</p>}
                  {!viaMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button onClick={() => handleDecrement(product.id)} className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2">
                        -
                      </button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button onClick={() => handleIncrement(product.id)} className="text-sm bg-green-500 focus:ring-4 rounded-lg px-8 py-2">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button className="button-blue w-40 mt-10 mb-5" onClick={handleAddToCart}>
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Brochettes;
