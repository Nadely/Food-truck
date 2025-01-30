"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const SnacksVeggies = () => {
  const searchParams = useSearchParams();
  const viaVeggiMitraillette =
    searchParams.get("viaVeggiMitraillette") === "true";
  const isMenu = searchParams.get("menu") === "true"; // Check for menu query parameter
  const router = useRouter();
  const { addToCart } = useCart();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.SnacksVeggies.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnackVeggie, setSelectedSnackVeggie] = useState<number | null>(
    null
  );

  const handleIncrement = (id: number) => {
    if (!viaVeggiMitraillette) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaVeggiMitraillette) {
      setQuantities((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 0) }));
    }
  };

  const handleSelectSnack = (product: any) => {
    setSelectedSnackVeggie(product.id);
  };

  const handleAddToCart = () => {
    if (viaVeggiMitraillette && selectedSnackVeggie !== null) {
      const product = data.SnacksVeggies.find(
        (item) => item.id === selectedSnackVeggie
      );
      if (product) {
        addToCart({
          relatedItems: [{ id: product.id, name: product.name }],
        });
        router.push(`Sauces?viaSnacks=true${isMenu ? "&menu=true" : ""}`);
      }
    } else {
      const itemsToAdd = data.SnacksVeggies.map((product) => {
        const quantity = quantities[product.id];
        if (quantity > 0) {
          return {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity,
          };
        }
        return null;
      }).filter(Boolean);

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach((item) => addToCart(item));
        router.push(
          `/nouvelle_commande${isMenu ? "/SnacksVeggies?menu=true" : ""}`
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">
        Snacks Veggies
      </h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {data.SnacksVeggies.filter(
              (product) =>
                viaVeggiMitraillette || product.name !== "Steack haché"
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  viaVeggiMitraillette && selectedSnackVeggie === product.id
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSnack(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaVeggiMitraillette && (
                    <p className="text-sm mt-auto">{product.price}</p>
                  )}
                  {!viaVeggiMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button
                        onClick={() => handleDecrement(product.id)}
                        className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2"
                      >
                        -
                      </button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button
                        onClick={() => handleIncrement(product.id)}
                        className="text-sm bg-green-500 focus:ring-4 rounded-lg px-8 py-2"
                      >
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
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnacksVeggies;
