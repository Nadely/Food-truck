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

      // Si c'est un menu et que c'est la première boisson (index === 0), on applique le prix de 1€ et on masque le nom
      const calculatedPrice =
        isMenu && index === 0 ? 1 : parseFloat(product.price);

      // Si la boisson est dans un menu, on applique le supplément de 1€ seulement pour la première boisson
      const supplementPrice = isMenu && index === 0 ? 1 : 0;

      const item = {
        id: product.id,
        name: isMenu && index === 0 ? "" : product.name, // Masquer le nom uniquement pour la 1ère boisson du menu
        price: calculatedPrice,
        quantity: quantities[product.id],
        uniqueId: `${product.id}-${Date.now()}`,
        menuOption: isMenu,
        supplementPrice: supplementPrice,
        viaSupplements: true,
        relatedItems:
          isMenu && index === 0 ? [{ id: product.id, name: product.name }] : [], // Ajouter la première boisson au relatedItems
      };

      addToCart(item);
    });

    router.push("/nouvelle_commande");
  };


  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">
        Boissons
      </h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
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
                  className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
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
                    width={90}
                    height={90}
                  />
                  <p className="text-sm mt-auto">{product.name}</p>
                  {!viaSupplements && (
                    <p className="text-sm mt-auto">
                      {menus ? "1€" : `${product.price}`}
                    </p>
                  )}
                  {product.name === "Aucune boisson" ? (
                    <></>
                  ) : (
                    <div className="flex flex-row items-center gap-4">
                      <button
                        onClick={() => handleDecrement(product.id)}
                        className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2 "
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

export default Boissons;
