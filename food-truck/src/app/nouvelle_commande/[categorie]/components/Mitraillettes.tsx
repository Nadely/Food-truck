"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import data from "../../dataProduits.json";

const Mitraillettes = () => {
  const [menus, setMenus] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

  const handleProduitClick = (product: any) => {
    const route =
      product.id === 1
        ? "Snacks" // assurez-vous de la casse
        : product.id === 3
        ? "Brochettes"
        : ""; // option par défaut

    if (route) {
      router.push(`/nouvelle_commande/${route}?viaMitraillette=true`);
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Mitraillettes</h1>
      <div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-8 mb-5">
        {data.Mitraillettes.map((product) => (
          <button
            key={product.id}
            onClick={() => handleProduitClick(product)}
            className="button-green flex flex-col items-center justify-center"
            style={{ width: "200px", height: "200px" }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-3/4 object-cover mb-2"
            />
            <span>{product.name}</span>
            <span>{product.price}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <label className="flex items-center gap-2 text-lg">
          Option Menu ?*
          <input
            type="checkbox"
            checked={menus}
            onChange={handleCheckboxChange}
          />
        </label>
        <div className="flex flex-col items-center justify-center mt-2 gap-4 text-sm">*Cela inclus des frites supplémentaires et 3€ au prix de indiqué.</div>
      </div>
    </div>
  );
};

export default Mitraillettes;
