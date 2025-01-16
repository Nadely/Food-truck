"use client";

import data from "./dataProduits.json";
import { useRouter } from "next/navigation";
import Image from "next/image";

const categorieColors: Record<string, string> = {
  "Mitraillettes": "bg-red-200",  // Couleur pour Mitraillettes
  "Burgers": "bg-yellow-200", // Couleur pour Burger
  "Veggies": "bg-green-200",  // Couleur pour Salad
  "Enfants": "bg-blue-200",  // Couleur pour Menu_Enfants
  "AperoBox": "bg-purple-200", // Couleur pour AperoBox
  "Boissons": "bg-pink-200",  // Couleur pour Boissons
  "Frites": "bg-orange-200", // Couleur pour Frites
  "Brochettes": "bg-cyan-200", // Couleur pour Brochettes
  "SnacksVeggies": "bg-lime-200", // Couleur pour SnacksVeggies
  "Snacks": "bg-teal-200", // Couleur pour Snacks
};

const NouvelleCommande = () => {
  const router = useRouter();


  return (
    <div className="font-bold font-serif text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-black font-bold font-serif text-2xl gap-4 mb-5">Faites votre choix !</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5">
        {Object.keys(data)
          .filter(
            (categorie) =>
              categorie !== "Supplements" &&
              categorie !== "Pains" &&
              categorie !== "Sauces"
          )
          .map((categorie, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(`/nouvelle_commande/${categorie}`); // Navigue vers la bonne catégorie
              }}
              className={`${categorieColors[categorie]} border-2 border-black rounded-lg p-4 flex flex-col items-center justify-center gap-4 cursor-pointer`}
              style={{ width: "180px", height: "180px" }}
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
