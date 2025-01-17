"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";

const AperoBox = () => {
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.AperoBox.reduce((acc: { [key: number]: number }, product) => {
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
      <h1 className="border-b-2 border-black w-full text-center mr-5">AperoBox</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.AperoBox.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center gap-4 border-2 border-black rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                style={{ width: "180px", height: "220px" }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                />
                <p className="text-sm mt-auto">{product.name}</p>
                <p className="text-sm mt-auto">{product.price}€</p>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => handleDecrement(product.id)}
                    className="text-sm px-2 py-1 rounded-lg"
                  >
                    -
                  </button>
                  <span className="text-sm">{quantities[product.id]}</span>
                  <button
                    onClick={() => handleIncrement(product.id)}
                    className="text-sm px-2 py-1 rounded-lg"
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
                router.push("Sauces?viaAperoBox=true");
              } else {
                alert("Veuillez sélectionner au moins une quantité avant de valider !");
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

export default AperoBox;
