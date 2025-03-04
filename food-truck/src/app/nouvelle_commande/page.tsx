"use client";

import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NouvelleCommande = () => {
  const router = useRouter();

  return (
    <div className="font-bold font-serif text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Faites votre choix !
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-5">
        {Object.keys(data)
          .filter(
            (categorie) => categorie !== "Supplements" && categorie !== "Pains"
          )
          .map((categorie, index) => (
            <button
              key={index}
              onClick={() =>
                router.push(`/nouvelle_commande/${categorie}`)
              }
              className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform  duration-200 hover:shadow-md"
              style={{ width: "200px", height: "200px" }}
            >
              <Image
                src={`/${categorie}.png`}
                alt={categorie}
                fill
                className="object-cover"
              />
              {/* Zone de texte avec background couvrant toute la largeur (et hauteur) de la zone du nom */}
              <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black">
                {categorie}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default NouvelleCommande;
