"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";

const Frites = () => {
  const router = useRouter();

  const [selectedFrites, setSelectedFrites] = useState<number[]>([]); // Permet de sélectionner plusieurs Frites

  const handleSelectSauce = (id: number) => {
    setSelectedFrites((prevSelected) =>
      prevSelected.includes(id) // Vérifie si la sauce est déjà sélectionnée
        ? prevSelected.filter((sauceId) => sauceId !== id) // Retire si déjà sélectionnée
        : [...prevSelected, id] // Ajoute sinon
    );
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Frites</h1>
      <div className="inline-block w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 gap-1">
            {data.Frites.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedFrites.includes(product.id) ? "bg-green-200 border-4 border-green-500 rounded-lg" : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer"
                  style={{ width: "180px", height: "180px" }}
                  onClick={() => handleSelectSauce(product.id)}
                >
                  <Image src={product.image} alt={product.name} width={100} height={100} />
                  <p className="text-sm mt-auto">{product.name}</p>
                  <p className="text-sm mt-auto">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={() => {
              if (selectedFrites.length > 0) {
                router.push("Sauces?viaFrites=true");
              } else {
                alert("Veuillez sélectionner au moins une sauce avant de valider !");
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
