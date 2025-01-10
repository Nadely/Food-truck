"use client";

import data from "./dataProduits.json";
import { useRouter } from "next/navigation";

const NouvelleCommande = () => {
  const router = useRouter();

  return (
    <div className="mt-10 font-bold font-serif text-lg mb-5">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5">
        {Object.keys(data)
          .filter(
            (categorie) =>
              categorie !== "Garnitures" &&
              categorie !== "Desserts" &&
              categorie !== "Pains" &&
              categorie !== "Sauces"
          )
          .map((categorie, index) => (
            <button
              key={index}
              onClick={() => {
                router.push(`/nouvelle_commande/${categorie}`); // Navigue vers la bonne catégorie
              }}
              className="button-blue flex items-center justify-center w-full h-20 text-center"
              style={{ width: "180px", height: "180px" }}
            >
              {categorie}
            </button>
          ))}
      </div>
    </div>
  );
};

export default NouvelleCommande;
