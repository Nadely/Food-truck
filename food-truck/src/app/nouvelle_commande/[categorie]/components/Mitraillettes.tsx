"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "../../dataProduits.json";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const Mitraillettes = () => {
  const [menus, setMenus] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

  const handleProduitClick = (product: Product) => {
    const route =
      product.id === 1
        ? "Snacks"
        : product.id === 2
        ? "Sauces"
        : product.id === 3
        ? "Brochettes"
        : "";

    if (route) {
      router.push(`/nouvelle_commande/${route}?viaMitraillette=true`);
    } else {
      console.error("Produit invalide ou route manquante");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Mitraillettes</h1>
      <div className="w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
        {data.Mitraillettes.map((product) => (
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
        <div className="flex flex-col items-center justify-center mt-2 gap-4 text-sm">*Cela inclus des frites supplémentaires et 3€ au prix de indiqué.</div>
      </div>
    </div>
  );
};

export default Mitraillettes;
