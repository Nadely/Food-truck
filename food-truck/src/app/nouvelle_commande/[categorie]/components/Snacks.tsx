"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const Snacks = () => {
  const searchParams = useSearchParams();
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Snacks.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnack, setSelectedSnack] = useState<number | null>(null);

  const handleIncrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaMitraillette) {
      setQuantities(prev => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
    }
  };

  const handleSelectSnack = (product: any) => {
    setSelectedSnack(product.id);
  };

  const handleAddToCart = () => {
    if (viaMitraillette && selectedSnack !== null) {
      const produit = data.Snacks.find(item => item.id === selectedSnack);
      if (produit) {
        addToCart({

          relatedItems: [{ id: produit.id, name: produit.name }],
        });
        router.push("Sauces?viaSnacks=true");
      }
    } else {
      const itemsToAdd = data.Snacks
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
        router.push("/nouvelle_commande");
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Snacks</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.Snacks.filter(product => viaMitraillette || product.name !== "Steack haché").map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${viaMitraillette && selectedSnack === product.id ? "bg-green-200 border-4 border-green-500 rounded-lg" : ""}`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSnack(product)}
                >
                  <Image src={product.image} alt={product.name} width={100} height={100} className="object-contain" />
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaMitraillette && <p className="text-sm mt-auto">{product.price}</p>}
                  {!viaMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button onClick={() => handleDecrement(product.id)} className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2">-</button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button onClick={() => handleIncrement(product.id)} className="text-sm bg-green-500 focus:ring-4 rounded-lg px-8 py-2">+</button>
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

export default Snacks;
