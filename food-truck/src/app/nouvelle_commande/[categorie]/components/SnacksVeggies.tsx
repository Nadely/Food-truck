"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";
import { useRouter } from "next/navigation";

const SnacksVeggies = () => {
  const searchParams = useSearchParams();
  const viaVeggiMitraillette = searchParams.get("viaVeggiMitraillette") === "true";
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.SnacksVeggies.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnackVeggies, setSelectedSnackVeggies] = useState<number | null>(null);

  const handleIncrement = (id: number) => {
    if (!viaVeggiMitraillette) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] + 1,
      }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaVeggiMitraillette) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
      }));
    }
  };

  const handleSelectSnack = (id: number) => {
    if (viaVeggiMitraillette) {
      setSelectedSnackVeggies(id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Snacks</h1>
      <div className="inline-block w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {data.SnacksVeggies.filter(
              (product) =>
                viaVeggiMitraillette || product.name !== "Steack haché"
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  viaVeggiMitraillette && selectedSnackVeggies === product.id
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "180px", height: "180px" }}
                  onClick={() => handleSelectSnack(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                  />
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaVeggiMitraillette && <p className="text-sm mt-auto">{product.price}</p>}
                  {!viaVeggiMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button
                        onClick={() => handleDecrement(product.id)}
                        className="text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button
                        onClick={() => handleIncrement(product.id)}
                        className="text-sm"
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
            onClick={() =>
              viaVeggiMitraillette
                ? router.push("Sauces?viaSnacksVeggies=true")
                : router.push("/panier.json")
            }
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnacksVeggies;
