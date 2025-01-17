"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";

const Frites = () => {
  const router = useRouter();

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
      [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Frites</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
            {data.Frites.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center gap-4 border-2 border-black rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                style={{ width: "200px", height: "200px" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={70}
                  height={70}
                />
                <p className="text-sm mt-auto">{product.name}</p>
                <p className="text-sm mt-auto">{product.price}€</p>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => handleDecrement(product.id)}
                    className="text-sm px-2 py-1 rounded-lg bg-red-500 focus:ring-4 rounded-lg px-8 py-2 "
                  >
                    -
                  </button>
                  <span className="text-sm">{quantities[product.id]}</span>
                  <button
                    onClick={() => handleIncrement(product.id)}
                    className="text-sm px-2 py-1 rounded-lg bg-green-500 focus:ring-4 rounded-lg px-8 py-2 "
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={() => {
              if (Object.values(quantities).some((qty) => qty > 0)) {
                router.push("Sauces?viaFrites=true");
              } else {
                alert("Veuillez sélectionner une quantité avant de valider !");
              }
            }}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Frites;
