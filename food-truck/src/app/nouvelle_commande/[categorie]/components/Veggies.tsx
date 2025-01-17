"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "@/data/dataProduits.json";
import { useState } from "react";


const Veggies = () => {
  const [menus, setMenus] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

  const handleProduitClick = (product: any) => {
    const route =
      product.id === 1
        ? "SnacksVeggies"
				: product.id === 2
        ? "Supplements"
        : ""; // option par défaut

    if (route) {
      router.push(`/nouvelle_commande/${route}?viaVeggiMitraillette=true`);
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Veggies</h1>
      <div className="w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-8 mb-5">
        {data.Veggies.map((product) => (
          <button
            key={product.id}
            onClick={() => handleProduitClick(product)}
            className="flex flex-col items-center justify-center gap-4 border-2 border-black rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
            style={{ width: "200px", height: "200px" }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
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
				<label className="flex items-center gap-2 text-lg">
					Option double garniture ?*
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

export default Veggies;
