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
      <div className="w-full flex flex-row flex-wrap items-center justify-center mt-10 style-pen text-lg gap-3 mb-5">
        {Object.keys(data)
          .filter(
            (categorie) => categorie !== "Supplements" && categorie !== "Pain" && categorie !== "Steack"
          )
          .map((categorie, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 flex-grow basis-[180px] max-w-[220px]"
            >
              <div
                className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1.5 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                onClick={() =>
                  router.push(`/nouvelle_commande/${categorie}`)
                }
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`/${categorie}.png`}
                    alt={categorie}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1.5 text-center border-t border-black rounded-b-lg">
                  <p className="text-sm mt-auto mb-0.5">{categorie}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NouvelleCommande;
