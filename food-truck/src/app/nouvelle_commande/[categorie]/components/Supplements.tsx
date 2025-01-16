"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../dataProduits.json";

const Supplements = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const viaSnacks = searchParams.get("viaSnacks") === "true";
  // const viaBrochettes = searchParams.get("viaBrochettes") === "true";
  // const viaSnacksVeggies = searchParams.get("viaVeggi") === "true";

  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);

  const ID_NONE = 10;

  const handleSelectSupplements = (id: number) => {
    setSelectedSupplements((prevSelected) => {
      // Si "aucun" est sélectionné, empêcher toute autre sélection
      if (id === ID_NONE) {
        return prevSelected.includes(ID_NONE) ? [] : [ID_NONE]; // Toggle "aucun"
      }

      // Si un autre supplément est sélectionné et "aucun" est actif, désactiver "aucun"
      if (prevSelected.includes(ID_NONE)) {
        return [id];
      }

      // Sinon, gérer la sélection normale
      return prevSelected.includes(id)
        ? prevSelected.filter((supplementsId) => supplementsId !== id) // Retirer si déjà sélectionné
        : [...prevSelected, id]; // Ajouter sinon
    });
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Suppléments</h1>
      <div className="inline-block w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-1">
            {data.Supplements.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedSupplements.includes(product.id)
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer"
                  style={{ width: "180px", height: "180px" }}
                  onClick={() => handleSelectSupplements(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                  />
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
            if (selectedSupplements.length > 0) {
              // Récupérer les paramètres existants depuis `searchParams`
              const params = new URLSearchParams(searchParams);

              // Ajouter ou mettre à jour le paramètre `viaSupplements=true`
              params.set("viaSupplements", "true");

              // Construire l'URL finale avec tous les paramètres
              const newUrl = `Boissons/?${params.toString()}`;

              // Rediriger vers la nouvelle URL
              router.push(newUrl);
            } else {
              alert("Veuillez sélectionner au moins un supplément avant de valider !");
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

export default Supplements;
