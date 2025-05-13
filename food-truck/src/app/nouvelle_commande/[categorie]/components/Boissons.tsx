"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import data from "@/data/dataProduits.json";
import { useCart } from "@/app/context/CartContext";

const Boissons = () => {
  const searchParams = useSearchParams();
  const viaSupplements = searchParams.get("viaSupplements") === "true";
  const router = useRouter();
  const { addToCart } = useCart();
  const menus = searchParams.get("menu") === "true"; // Lecture du paramètre 'menu' de l'URL

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Boissons.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );
  const [selectedBoissons, setSelectedBoissons] = useState<number | null>(null);

  const handleSelectBoissons = (id: number) => {
    // Si "Aucune boisson" est sélectionnée, réinitialisez les quantités
    if (
      data.Boissons.find((product) => product.id === id)?.name ===
      "Aucune boisson"
    ) {
      setQuantities(
        data.Boissons.reduce((acc: any, product: any) => {
          if (product.id !== id) {
            acc[product.id] = 0; // Réinitialisez les quantités des autres boissons
          }
          return acc;
        }, {})
      );
    }

    setSelectedBoissons(id);
  };
  //
  const handleIncrement = (id: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities, [id]: prevQuantities[id] + 1 };

      // Si la quantité de n'importe quelle boisson devient supérieure à 0,
      // désélectionnez "Aucune boisson" si elle est sélectionnée
      if (
        selectedBoissons ===
        data.Boissons.find((product) => product.name === "Aucune boisson")?.id
      ) {
        if (Object.values(newQuantities).some((quantity) => quantity > 0)) {
          setSelectedBoissons(null); // Désélectionne "Aucune boisson"
        }
      }

      return newQuantities;
    });
  };

  const handleDecrement = (id: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = {
        ...prevQuantities,
        [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
      };

      // Si la quantité de n'importe quelle boisson devient supérieure à 0,
      // désélectionnez "Aucune boisson" si elle est sélectionnée
      if (
        selectedBoissons ===
        data.Boissons.find((product) => product.name === "Aucune boisson")?.id
      ) {
        if (Object.values(newQuantities).some((quantity) => quantity > 0)) {
          setSelectedBoissons(null); // Désélectionne "Aucune boisson"
        }
      }

      return newQuantities;
    });
  };

  const handleAddToCart = () => {
    const aucuneBoisson = data.Boissons.find(
      (product) => product.name === "Aucune boisson"
    ) ?? { id: -1, name: "Aucune boisson" };
    const aucuneBoissonId = aucuneBoisson.id;

    // Si "Aucune boisson" est sélectionnée, validez sans vérifier les quantités
    if (selectedBoissons === aucuneBoissonId) {
      const item = {
        id: aucuneBoisson.id,
        name: aucuneBoisson.name,
        image: aucuneBoisson.image,
        price: 0, // Prix de "Aucune boisson" est toujours 0
        quantity: 1, // Peut être considéré comme sélectionné une fois
        uniqueId: `${aucuneBoisson.id}-${Date.now()}`,
        menuOption: menus,
        supplementPrice: 0,
        viaSupplements: true,
        relatedItems: [],
      };

      addToCart(item);
      router.push("/nouvelle_commande");
      return;
    }

    // Sinon, vérifiez les quantités pour les autres boissons
    const selectedProducts = data.Boissons.filter(
      (product) => quantities[product.id] > 0
    );

    if (selectedProducts.length === 0) {
      alert("Veuillez sélectionner au moins une boisson.");
      return;
    }

    selectedProducts.forEach((product, index) => {
      const isMenu = menus;

      const isLeffe = product.name === "Leffe" || product.name === "Leffe Blanche" || product.name === "Leffe Ruby";

      // Si c'est un menu et que c'est la première boisson (index === 0), on applique le prix de 1€ et on masque le nom
      const calculatedPrice =
        isMenu && index === 0 && !isLeffe ? 1 : parseFloat(product.price);

      // Si la boisson est dans un menu, on applique le supplément de 1€ seulement pour la première boisson
      const supplementPrice = isMenu && index === 0 && !isLeffe ? 1 : 0;

      const item = {
        id: product.id,
        name: isMenu && index === 0 ? "" : product.name, // Masquer le nom uniquement pour la 1ère boisson du menu
        image: product.image,
        price: calculatedPrice,
        quantity: quantities[product.id],
        uniqueId: `${product.id}-${Date.now()}`,
        menuOption: isMenu,
        supplementPrice: supplementPrice,
        viaSupplements: true,
        relatedItems:
          isMenu && index === 0 ? [{ id: product.id, name: product.name, image: product.image }] : [], // Ajouter la première boisson au relatedItems
      };

      addToCart(item);
    });

    router.push("/nouvelle_commande");
  };


  return (
    <div className="style-pen text-xl mb-5 mt-2">
    <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
      Boissons
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-5">
            {data.Boissons.filter(
              (product) => viaSupplements || product.name !== "Aucune boisson"
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 ${
                  selectedBoissons === product.id
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                  style={{ width: "200px", height: "200px" }}
                  onClick={() => {
                    if (product.name === "Aucune boisson") {
                      handleSelectBoissons(product.id);
                    }
                  }}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg ">
                    <p className="text-sm mt-auto">{product.name}</p>
                    {product.name === "Aucune boisson" ? (
                      <></>
                    ) : (
                      <div className="flex flex-row items-center gap-4">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          className="text-sm bg-red-500 ml-3 focus:ring-4 rounded-lg px-8 py-2 "
                          >
                          -
                        </button>
                        <span className="text-sm">{quantities[product.id]}</span>
                        <button
                          onClick={() => handleIncrement(product.id)}
                          className="text-sm bg-green-500 focus:ring-4 rounded-lg px-8 py-2 "
                          >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                    {!viaSupplements && (
                      <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-auto">
                        {menus ? "1€" : `${product.price}`}
                      </p>
                    )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Boissons;
