"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useCart } from "@/app/context/CartContext";

const Sauces = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viaFrites = parseInt(searchParams.get("viaFrites") || "0", 10);
  const viaAperoBox = parseInt(searchParams.get("viaAperoBox") || "0", 10);
  const { addToCart } = useCart();

  const totalPortions = viaFrites + viaAperoBox; // Total portions
  const [selectedSauces, setSelectedSauces] = useState<number[]>([]);

  const handleSelectSauce = (id: number, name: string) => {
    if (name === "Aucune sauce") {
      // Clear all other sauces if "Aucune sauce" is selected
      setSelectedSauces((prevSelected) =>
        prevSelected.includes(id) ? [] : [id]
      );
    } else {
      setSelectedSauces((prevSelected) => {
        if (prevSelected.includes(id)) {
          // Deselect sauce
          return prevSelected.filter((sauceId) => sauceId !== id);
        } else {
          // Remove "Aucune sauce" and add the new sauce
          const updatedSelection = prevSelected.filter(
            (sauceId) =>
              sauceId !==
              data.Sauces.find((product) => product.name === "Aucune sauce")?.id
          );
          return [...updatedSelection, id];
        }
      });
    }
  };

  const handleAddToCart = () => {
    const relatedItems = data.Sauces.filter((product) =>
      selectedSauces.includes(product.id)
    ).map((product) => ({
      id: product.id,
      name: product.name,
    }));

    // Calculate the price
    const freeSauces = totalPortions; // Free sauces based on total portions
    const extraSauces = Math.max(selectedSauces.length - freeSauces, 0); // Extra sauces beyond free
    const price = extraSauces * 0.5;

    const item = {
      id: "sauces",
      name: "Sauces",
      price: price,
      quantity: totalPortions,
      uniqueId: `sauces-${Date.now()}`,
      relatedItems: relatedItems,
    };

    addToCart(item);

    if (viaFrites !== 0 || viaAperoBox !== 0) {
      router.push("/nouvelle_commande");
    } else if (selectedSauces.length > 0) {
      router.push("Supplements?viaSauces=true");
    } else {
      alert("Veuillez sélectionner au moins une sauce avant de valider !");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Sauces</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {data.Sauces.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col items-center justify-center gap-4 ${
                selectedSauces.includes(product.id)
                  ? "bg-green-200 border-4 border-green-500 rounded-lg"
                  : ""
              }`}
            >
              <div
                className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                style={{ width: "200px", height: "200px" }}
                onClick={() => handleSelectSauce(product.id, product.name)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
                <p className="text-sm mt-auto">{product.name}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
          <p className="text-sm text-right mb-5">
            * Une sauce gratuite par portion, 0.50€/sauce supplémentaire
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sauces;
