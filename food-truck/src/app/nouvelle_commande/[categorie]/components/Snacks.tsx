"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";
import { useRouter } from "next/navigation";

const Snacks = () => {
  const searchParams = useSearchParams();
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Snacks.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnack, setSelectedSnack] = useState<number | null>(null);

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

  const handleSelectSnack = (id: number) => {
    if (viaMitraillette) {
      setSelectedSnack(id);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Snacks</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
            {data.Snacks.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  viaMitraillette && selectedSnack === product.id
                    ? "bg-green-200"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer"
                  style={{ width: "180px", height: "180px" }}
                  onClick={() => handleSelectSnack(product.id)}
                >
                  <Image src={product.image} alt={product.name} width={100} height={100} />
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaMitraillette && <p className="text-sm mt-auto">{product.price}</p>}
                  {!viaMitraillette && (
                    <div className="flex flex-row items-center gap-4">
                      <button onClick={() => handleDecrement(product.id)} className="text-sm">
                        -
                      </button>
                      <span className="text-sm">{quantities[product.id]}</span>
                      <button onClick={() => handleIncrement(product.id)} className="text-sm">
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
              viaMitraillette
                ? router.push("/Garnitures")
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

export default Snacks;
