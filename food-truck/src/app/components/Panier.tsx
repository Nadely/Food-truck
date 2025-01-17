"use client";

import data from "./panier.json";
import Image from "next/image";

const Panier = () => {
  // Calculer le total dynamiquement
  const total = Array.isArray(data) ? data.reduce((acc: number, produit: any) => acc + produit.price, 0) : 0;

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl mt-2 mb-auto">
      <h1 className="border-b-2 border-black w-full text-center ml-5 mr-5">Panier</h1>
      <div className="flex flex-col items-center justify-center gap-4 mt-5">
        {Array.isArray(data) && data.map((produit: any, index: number) => (
          <div key={index} className="flex flex-col items-center justify-center gap-4">
            <div className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center">
              <Image src={produit.image} alt={produit.name} width={100} height={100} />
              <p className="text-sm mt-auto">{produit.name}</p>
              <p className="text-sm mt-auto">${produit.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Total : {total.toFixed(2)}€</p>
      </div>
    </div>
  );
};

export default Panier;
