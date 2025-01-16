"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";

const Sauces = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viaFrites = searchParams.get("viaFrites");

  const [selectedSauces, setSelectedSauces] = useState<number[]>([]); // Permet de sélectionner plusieurs sauces

  const handleSelectSauce = (id: number, name: string) => {
    if (name === "Aucune sauce") {
      // Si "Aucune sauce" est cliqué, on désélectionne toutes les sauces
      setSelectedSauces(prevSelected =>
        prevSelected.length === 0 ? [] : [id] // Si déjà sélectionnée, on désélectionne tout
      );
    } else {
      setSelectedSauces(prevSelected => {
        if (prevSelected.includes(id)) {
          // Si la sauce est déjà sélectionnée, on la désélectionne
          return prevSelected.filter((sauceId) => sauceId !== id);
        } else {
          // Si "Aucune sauce" est sélectionnée, on la retire
          const updatedSelection = prevSelected.filter((sauceId) => sauceId !== data.Sauces.find((product) => product.name === "Aucune sauce")?.id);
          // Ajouter la sauce normalement
          return [...updatedSelection, id];
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Sauces</h1>
      <div className="inline-block w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.Sauces.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedSauces.includes(product.id) ? "bg-green-200 border-4 border-green-500 rounded-lg" : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer"
                  style={{ width: "180px", height: "180px" }}
                  onClick={() => handleSelectSauce(product.id, product.name)} // Ajout du nom de la sauce
                >
                  <Image src={product.image} alt={product.name} width={100} height={100} />
                  <p className="text-sm mt-auto">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
        <button
          className="button-blue w-40 mt-10 mb-5"
          onClick={() => {
            if (viaFrites) {
              // Si on est passé par les frites, rediriger vers le panier
              router.push("/panier.json");
            } else if (selectedSauces.length > 0) {
              // Sinon, si des sauces ont été sélectionnées, rediriger vers Supplements
              router.push("Supplements?viaSauces=true");
            } else {
              // Si aucune sauce n'est sélectionnée, afficher une alerte
              alert("Veuillez sélectionner au moins une sauce avant de valider !");
            }
          }}
        >
          Valider
        </button>
          <p className="text-sm text-right mb-5">
            * la première est gratuite, 0.50€/sauce à partir de la deuxième
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sauces;
