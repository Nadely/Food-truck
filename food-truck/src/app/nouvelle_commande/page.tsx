"use client";

import data from "../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NouvelleCommande = () => {
  const router = useRouter();

  return (
    <div className="font-bold style-pen text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Faites votre choix !
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-5 mb-5 w-full max-w-[1200px]">
        {Object.keys(data)
          .filter(
            (categorie) => categorie !== "Supplements" && categorie !== "Pain" && categorie !== "Steack"
          )
          .map((categorie, index) => (
            <button
              key={index}
              onClick={() =>
                router.push(`/nouvelle_commande/${categorie}`)
              }
              className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md flex-grow basis-[250px] max-w-[280px] aspect-square"
            >
              <Image
                src={`/${categorie}.png`}
                alt={categorie}
                fill
                className="object-cover"
              />
              {/* Zone de texte avec background couvrant toute la largeur (et hauteur) de la zone du nom */}
              <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                {categorie}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default NouvelleCommande;
