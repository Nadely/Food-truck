"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

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
    const groupId = `snacks-veggies-${Date.now()}`;

    if (viaVeggiMitraillette && selectedSnackVeggie !== null) {
      const product = data.SnacksVeggies.find(
        (item) => item.id === selectedSnackVeggie
      );
      if (product) {
        addToCart({
          id: product.id,
          name: product.name,
          image: product.image,
          price: parseFloat(product.price),
          quantity: 1,
          groupId: groupId,
          relatedItems: [{
            id: product.id,
            name: product.name,
            image: product.image,
            price: parseFloat(product.price),
            quantity: 1,
            groupId: groupId,
            isSnack: true
          }]
        });
        router.push(`Sauces?viaSnacksVeggies=true&groupId=${groupId}${isMenu ? "&menu=true" : ""}`);
      }
    } else {
      const itemsToAdd = data.SnacksVeggies.map((product) => {
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
        itemsToAdd.forEach((item) => {
          if (item) {
            addToCart({
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              groupId: groupId
            });
          }
        });
        router.push(
          `Sauces?viaSnacksVeggies=true&groupId=${groupId}${isMenu ? "&menu=true" : ""}`
        );
      }
    }
  };

  return (
    <div className="font-bold style-pen text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Snacks Veggies
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
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
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                  style={{ width: "200px", height: "200px" }}
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
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg ">
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaVeggiMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button
                        onClick={() => handleDecrement(product.id)}
                        className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2 ml-3"
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
                  {!viaVeggiMitraillette && (
                    <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-auto">
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

export default SnacksVeggies;
