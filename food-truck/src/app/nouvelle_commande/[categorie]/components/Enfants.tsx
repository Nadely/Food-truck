"use client";

import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

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
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">
        Enfants*
      </h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
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
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => handleSelectSnack(product.id)}
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

        {/* Produits non cliquables (id 5 et 6) */}
        <div className="flex flex-row items-center justify-center mt-8 gap-4">
          {data.Enfants.filter(
            (product) => product.id === 5 || product.id === 6
          ).map((product) => (
            <div
              key={product.id}
              className="border-2 border-gray-400 rounded-lg p-2 flex flex-col items-center justify-center"
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
                width={100}
                height={100}
              />
              <p className="text-sm mt-auto">{product.name}*</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm mt-2 item-center justify-center text-center">* 6.5€</p>
          <p className="text-sm mt-2">** Ce produit est inclus dans le menu</p>
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

export default Enfants;
