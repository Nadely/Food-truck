"use client";

import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categorieColors: Record<string, string> = {
  Mitraillettes: "bg-red-200",
  Burgers: "bg-yellow-200",
  Veggies: "bg-green-200",
  Enfants: "bg-blue-200",
  AperoBox: "bg-purple-200",
  Boissons: "bg-pink-200",
  Frites: "bg-orange-200",
  Brochettes: "bg-cyan-200",
  SnacksVeggies: "bg-lime-200",
  Snacks: "bg-teal-200",
  Sauces: "bg-red-300",
};

const NouvelleCommande = () => {
  const router = useRouter();

  return (
    <div className="font-bold font-serif text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-black font-bold font-serif text-2xl gap-4 mb-5">
        Faites votre choix !
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 mb-5">
        {Object.keys(data)
          .filter(
            (categorie) => categorie !== "Supplements" && categorie !== "Pains"
          )
          .map((categorie, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(`/nouvelle_commande/${categorie}`); // Navigue vers la bonne catégorie
              }}
              className={`${categorieColors[categorie]} border-2 border-black rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-green-400 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm`}
              style={{ width: "200px", height: "200px" }}
            >
              <div className="flex items-center justify-center">
                <Image
                  src={`/${categorie}.png`}
                  alt={categorie}
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex items-center justify-center">
                {categorie}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
};

export default NouvelleCommande;
