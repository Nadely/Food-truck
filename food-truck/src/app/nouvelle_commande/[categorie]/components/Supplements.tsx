"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useCart } from "../../../context/CartContext";

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
      image: product.image,
      price: parseFloat(product.price), // Convertir en nombre
    }));

    // Calcul du prix total uniquement des suppléments
    const supplementsPrice = relatedItems.reduce(
      (acc, product) => acc + product.price,
      0
    );

    // Création de l'objet à ajouter au panier
    const item = {
      id: `supplements-${Date.now()}`, // ID unique pour les suppléments
      price: supplementsPrice, // Prix total des suppléments
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
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Supplements *
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
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
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSupplements(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                  />
                  <p className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg text-sm">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
        <p className="text-center text-white text-sm">* 1€ par supplements</p>
      </div>
    </div>
  );
};

export default Supplements;
