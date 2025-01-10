"use client";

import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";
import router from "next/router";

const Snacks = ({ viaMitraillette = false }) => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Snacks.reduce((acc : {[key: number]: number}, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedSnack, setSelectedSnack] = useState<number | null>(null);

  const handleIncrement	 = (id: number) => {
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
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Snacks</h1>
      <div className="inline-block w-full flex flex-col items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {data.Snacks.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  viaMitraillette && selectedSnack === product.id
                    ? "bg-yellow-200" // Changement de couleur pour le snack sélectionné
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
          <button className="button-blue w-40 mt-10 mb-5" onClick={() => viaMitraillette ? router.push('/garniture') : router.push('/panier.json')}>Valider</button>
        </div>
      </div>
    </div>
  );
};

export default Snacks;
