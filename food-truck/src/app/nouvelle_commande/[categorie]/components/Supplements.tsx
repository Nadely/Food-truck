"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useCart } from "@/app/context/CartContext";

const Supplements = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viaSauces = searchParams.get("viaSauces") === "true";
  const viaBurgers = searchParams.get("viaBurgers") === "true";
  const { addToCart } = useCart();

  const [selectedSupplements, setSelectedSupplements] = useState<number[]>([]);

  const ID_NONE = 10;

  // Produit principal (exemple)
  const mainProduct = {
    id: 1, // Remplace par l'ID du produit principal
    name: "Produit Principal",
    price: "10.00", // Prix du produit principal
  };

  const handleSelectSupplements = (id: number) => {
    setSelectedSupplements((prevSelected) => {
      if (id === ID_NONE) {
        return prevSelected.includes(ID_NONE) ? [] : [ID_NONE];
      }

      if (prevSelected.includes(ID_NONE)) {
        return [id];
      }

      return prevSelected.includes(id)
        ? prevSelected.filter((supplementsId) => supplementsId !== id)
        : [...prevSelected, id];
    });
  };

  const handleAddToCart = () => {
    // Filtre les suppléments sélectionnés
    const relatedItems = data.Supplements.filter((product) =>
      selectedSupplements.includes(product.id)
    ).map((product) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price), // Convertir en nombre
    }));

    // Calcul du prix total uniquement des suppléments
    const supplementsPrice = relatedItems.reduce((acc, product) => acc + product.price, 0);

    // Création de l'objet à ajouter au panier
    const item = {
      id: `supplements-${Date.now()}`, // ID unique pour les suppléments
      price: supplementsPrice, // Prix total des suppléments
      quantity: 1,
      uniqueId: `supplements-${Date.now()}`, // ID unique pour cet article
      relatedItems, // Liste des suppléments sélectionnés
    };

    // Ajoute l'article au panier
    addToCart(item);

    // Determine the next route based on the parameters and append `menu=true` if needed
    let nextRoute = "Boissons?viaSupplements=true";

    // Add `&menu=true` if menu option is selected
    if (searchParams.get("menu") === "true") {
      nextRoute += "&menu=true";
    }

    // Redirige vers la page des boissons
    router.push(nextRoute);
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">Suppléments</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.Supplements.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedSupplements.includes(product.id)
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSupplements(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={100}
                    height={100}
                  />
                  <p className="text-sm mt-auto">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Supplements;
