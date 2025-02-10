"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useCart } from "@/app/context/CartContext";

const Sauces = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viaSnacksVeggies = searchParams.get("viaSnacksVeggies");
  const isMenu = searchParams.get("menu") === "true";
  const viaFrites = searchParams.get("viaFrites");
  const viaEnfants = searchParams.get("viaEnfants");
  const viaSnacks = searchParams.get("viaSnacks");
  const viaBrochettes = searchParams.get("viaBrochettes");
  const viaAperoBox = searchParams.get("viaAperoBox");
  const viaMitraillette = searchParams.get("viaMitraillette");
  const { addToCart } = useCart();

  const [selectedSauces, setSelectedSauces] = useState<number[]>([]);

  const handleSelectSauce = (id: number) => {
    setSelectedSauces((prevSelected) => {
      if (id === 18) {
        // Vérifie si "Aucune sauce" est sélectionnée
        return prevSelected.includes(id) ? [] : [id]; // Si déjà sélectionnée, déselectionne toutes les sauces
      } else {
        if (prevSelected.includes(18)) {
          // Si "Aucune sauce" est sélectionnée, déselectionne tout
          return [id]; // Si une autre sauce est sélectionnée après "Aucune sauce", remplace-la
        }
        // Sinon, sélectionne/déselectionne la sauce normalement
        if (prevSelected.includes(id)) {
          return prevSelected.filter((sauceId) => sauceId !== id);
        } else {
          return [...prevSelected, id];
        }
      }
    });
  };

  const handleAddToCart = () => {
    const relatedItems = data.Sauces.filter((product) =>
      selectedSauces.includes(product.id)
    ).map((product) => ({
      id: product.id,
      name: product.name,
    }));

    let price = 0;
    let freeSauces = 0;

    // Calcul des sauces gratuites basées sur les paramètres
    const selectedAperoBoxes = searchParams.getAll("selectedAperoBox");
    const aperoBoxQuantities = selectedAperoBoxes.reduce((acc, boxName) => {
      const box = data.AperoBox.find((item) => item.name === boxName);
      return box ? acc + 1 : acc;
    }, 0);

    // Appliquer les sauces gratuites selon les ApéroBox
    data.AperoBox.forEach((box) => {
      const quantity = parseInt(searchParams.get(box.name) || "0");
      if (quantity > 0) {
        freeSauces += quantity * (box.name === "Party Box" ? 2 : 1);
      }
    });

    // Sauces gratuites pour les frites
    data.Frites.forEach((frites) => {
      const quantity = parseInt(searchParams.get(frites.name) || "0");
      if (quantity > 0) {
        freeSauces += quantity; // 1 sauce gratuite par portion de frites
      }
    });

    // Ajouter les sauces gratuites pour les autres produits
    if (viaSnacks === "true") freeSauces += 1;
    if (viaSnacksVeggies === "true") freeSauces += 1;
    if (viaEnfants === "true") freeSauces += 1;
    if (viaBrochettes === "true") freeSauces += 1;
    if (viaMitraillette === "true") freeSauces += 1;

    // Calculer le nombre de sauces payantes
    const saucesPaid = Math.max(0, selectedSauces.length - freeSauces);
    price = saucesPaid * 0.5;

    console.log("Prix total des sauces supplémentaires :", price);

    const item = {
      id: "sauces",
      price: price,
      quantity: 1,
      uniqueId: `sauces-${Date.now()}`,
      relatedItems: relatedItems,
    };

    addToCart(item);

    // Déterminer la prochaine route
    let nextRoute = "";

    if (
      viaSnacks === "true" ||
      viaSnacksVeggies === "true" ||
      viaBrochettes === "true" ||
      viaMitraillette === "true"
    ) {
      nextRoute = "Supplements?viaSauces=true";
    } else {
      nextRoute = "/nouvelle_commande";
    }

    // Ajouter `&menu=true` si menu est sélectionné
    if (isMenu && nextRoute.includes("?")) {
      nextRoute += (nextRoute.includes("?") ? "&" : "?") + "menu=true";
    }

    router.push(nextRoute);
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Sauces *</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {data.Sauces.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col items-center justify-center gap-4 ${
                selectedSauces.includes(product.id)
                  ? "bg-green-200 border-4 border-green-500 rounded-lg"
                  : ""
              }`}
            >
              <div
                className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                style={{ width: "200px", height: "200px" }}
                onClick={() => handleSelectSauce(product.id)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="object-contain"
                />
                <p className="text-sm mt-auto">{product.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
          {viaAperoBox === "true" && (
            <p className="text-sm text-right mb-5">
              * La première est gratuite, sauf pour Party Box (2 gratuites).
            </p>
          )}
          {(viaFrites === "true" ||
            viaSnacksVeggies === "true" ||
            viaSnacks === "true" ||
            viaBrochettes === "true" ||
            viaEnfants === "true" ||
            viaMitraillette === "true") && (
            <p className="text-sm text-right mb-5">
              * La première est gratuite.
            </p>
          )}
          <p className="text-sm text-right mb-5">* 0.50€/sauce.</p>
        </div>
      </div>
    </div>
  );
};

export default Sauces;
