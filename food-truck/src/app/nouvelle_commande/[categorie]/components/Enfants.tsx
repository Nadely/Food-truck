"use client";

import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const Enfants = () => {
  const route = useRouter();
  const [selectedEnfants, setSelectedEnfants] = useState<number[]>([]);
  const { addToCart } = useCart();

  const handleSelectSnack = (id: number) => {
    setSelectedEnfants((prevSelected) => {
      if (id === 1 && prevSelected.includes(2)) {
        return prevSelected.filter((selectedId) => selectedId !== 2).concat(id);
      }
      if (id === 2 && prevSelected.includes(1)) {
        return prevSelected.filter((selectedId) => selectedId !== 1).concat(id);
      }
      if (id === 3 && prevSelected.includes(4)) {
        return prevSelected.filter((selectedId) => selectedId !== 4).concat(id);
      }
      if (id === 4 && prevSelected.includes(3)) {
        return prevSelected.filter((selectedId) => selectedId !== 3).concat(id);
      }
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
      return [...prevSelected, id];
    });
  };

  const handleAddToCart = () => {
    if (selectedEnfants.length === 0) {
      alert("Veuillez sélectionner au moins un produit avant de valider !");
      return;
    }

    // Filtrer les produits sélectionnés
    const selectedProducts = data.Enfants.filter((product) =>
      selectedEnfants.includes(product.id)
    );

    // Identifier le produit principal (id 1 ou 2) pour le prix et la catégorie
    const mainProduct = selectedProducts.find(
      (product) => product.id === 1 || product.id === 2
    );

    if (!mainProduct) {
      alert("Veuillez sélectionner un produit principal (id 1 ou 2) !");
      return;
    }

    // Construire l'objet à ajouter au panier
    const item = {
      name: "Menu Enfants",
      image: mainProduct.image,
      price: parseFloat(mainProduct.price), // Prix principal
      quantity: 1,
      uniqueId: `${mainProduct.id}-${Date.now()}`,
      relatedItems: selectedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        image: product.image,
      })), // Produits liés
    };

    // Ajouter au panier
    addToCart(item);

    // Redirection vers la page "nouvelle_commande"
    route.push("Sauces?viaEnfants=true");
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Enfants*
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        {/* Produits cliquables */}
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {data.Enfants.filter(
              (product) => product.id !== 5 && product.id !== 6
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedEnfants.includes(product.id)
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                 className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSnack(product.id)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={150}
                    height={150}
                  />
                  <p className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg ">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produits non cliquables (id 5 et 6) */}
        <div className="flex flex-row items-center justify-center mt-8 gap-4">
          {data.Enfants.filter(
            (product) => product.id === 5 || product.id === 6
          ).map((product) => (
            <div
              key={product.id}
              className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
              style={{
                width: "180px",
                height: "180px",
                backgroundColor: "#f0f0f0",
                cursor: "not-allowed",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={150}
                height={150}
              />
              <p className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg ">{product.name}**</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-5">* 6.5€</p>
          <p className="text-sm text-white mt-2">** Ce produit est inclus dans le menu</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Enfants;
