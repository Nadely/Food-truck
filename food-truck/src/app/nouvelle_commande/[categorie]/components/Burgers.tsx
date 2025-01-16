"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import data from "../../dataProduits.json";
import { useState } from "react";

const Burgers = () => {
  const [menus, setMenus] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = () => {
    setMenus(!menus);
  };

	const handleProduitClick = (product: any) => {
		const validIds = [1, 2, 3, 4, 5, 6]; // Liste des IDs valides
		const route = validIds.includes(product.id) ? "Supplements" : null;

		if (route) {
			router.push(`/nouvelle_commande/${route}?viaBurgers=true`);
		} else {
			console.error("Produit invalide ou route manquante");
		}
	};


  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Burgers</h1>
      <div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
        {data.Burgers.map((product) => (
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

export default Burgers;
