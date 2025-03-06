"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const Sauces = () => {
  const searchParams = useSearchParams();
  const viaSnacks = searchParams.get("viaSnacks") === "true";
  const viaSnacksVeggies = searchParams.get("viaSnacksVeggies") === "true";
  const viaEnfants = searchParams.get("viaEnfants") === "true";
  const viaBrochettes = searchParams.get("viaBrochettes") === "true";
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const viaAperoBox = searchParams.get("viaAperoBox") === "true";
  const viaFrites = searchParams.get("viaFrites") === "true";
  const isMenu = searchParams.get("menu") === "true";
  const router = useRouter();
  const { addToCart } = useCart();

  let freeSauces = 0;
  data.AperoBox.forEach((box) => {
    const quantity = parseInt(searchParams.get(box.name) || "0");
    if (quantity > 0) {
      freeSauces += quantity * (box.name === "Party Box" ? 2 : 1);
    }
  });
  data.Frites.forEach((frites) => {
    const quantity = parseInt(searchParams.get(frites.name) || "0");
    if (quantity > 0) {
      freeSauces += quantity;
    }
  });
  if (viaSnacks) freeSauces += 1;
  if (viaSnacksVeggies) freeSauces += 1;
  if (viaEnfants) freeSauces += 1;
  if (viaBrochettes) freeSauces += 1;
  if (viaMitraillette) freeSauces += 1;

  // On initialise les quantités pour la sélection (pour les cas non via ou viaAperoBox)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Sauces.reduce((acc: { [key: number]: number }, sauce) => {
      acc[sauce.id] = 0;
      return acc;
    }, {})
  );
  // Pour les autres via (ex. viaSnacks, viaMitraillette), on utilise une sélection simple (1 clic)
  const [selectedSauce, setSelectedSauce] = useState<number | null>(null);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) - 1, 0), // Ne pas descendre en dessous de 0
    }));
  };

  const handleSelectSauce = (sauce: any) => {
    // Pour les modes via (sauf viaAperoBox) : sélection par clic unique
    if (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) {
      setSelectedSauce(sauce.id);
    }
  };

  const handleAddToCart = () => {
    // Fonction pour calculer le nombre de sauces gratuites par produit
    const calculateFreeSauces = (product: string, quantity: number): number => {
        if (product=== "Party Box") {
            return Math.min(quantity * 2, 1); // 2 sauces gratuites pour Party Box, mais pas plus que la quantité choisie
        }
        return Math.min(quantity, 1); // 1 sauce gratuite pour les autres produits, pas plus que la quantité choisie
    };

    // Cas pour viaAperoBox ou viaFrites
    if (viaAperoBox || viaFrites) {
      const itemsToAdd = data.Sauces.map((sauce) => {
        const quantity = quantities[sauce.id];
        if (quantity > 0) {
          const paidCount = Math.max(0, quantity - calculateFreeSauces(sauce.name, quantity)); // Sauces payantes
          const totalPrice = paidCount * 0.5;
          const effectiveUnitPrice = paidCount > 0 ? totalPrice : 0.5;
          return {
            id: sauce.id,
            name: sauce.name,
            image: sauce.image,
            price: effectiveUnitPrice, // Prix unitaire effectif pour chaque sauce payante
            quantity: quantity, // Quantité totale ajoutée au panier
          };
        }
        return null;
      }).filter(Boolean);

        if (itemsToAdd.length > 0) {
            addToCart({
                relatedItems: itemsToAdd, // On ajoute toutes les sauces avec leur quantité
            });
            console.log("Ajout au panier (viaAperoBox/viaFrites) :", itemsToAdd);
        }
    }
    // Autres cas (viaSnacks, viaSnacksVeggies, etc.)
    else if (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) {
        if (selectedSauce !== null) {
            const sauce = data.Sauces.find((item) => item.id === selectedSauce);
            if (sauce) {
                addToCart({
                    relatedItems: [{
                        id: sauce.id,
                        name: sauce.name,
                        image: sauce.image,
                        price: 0.5, // Prix fixe pour une sauce sélectionnée
                        quantity: 1,
                    }],
                });
                console.log(`Ajout au panier (via) : ${sauce.name}, Prix: 0.5€`);
            }
        }
    }
    // Cas par défaut (sélection classique)
    else {
        const itemsToAdd = data.Sauces.map((sauce) => {
            const quantity = quantities[sauce.id];
            if (quantity > 0) {
                // Calcul du nombre de sauces gratuites pour ce produit
                const paidCount = Math.max(0, quantity); // Sauces payantes
                const totalPrice = paidCount * 0.5; // Prix total des sauces payantes
                const effectiveUnitPrice = paidCount > 0 ? totalPrice / paidCount : 0; // Prix unitaire effectif
                return {
                    id: sauce.id,
                    name: sauce.name,
                    image: sauce.image,
                    price: effectiveUnitPrice,
                    quantity, // Quantité incluse
                };
            }
            return null;
        }).filter(Boolean);

        if (itemsToAdd.length > 0) {
            itemsToAdd.forEach((item) => addToCart(item)); // Ajoute chaque sauce avec sa quantité au panier
            console.log("Ajout au panier (sélection classique) :", itemsToAdd);
        }
    }

    // Redirection après ajout au panier
    let nextRoute = "";
    if (viaSnacks || viaSnacksVeggies || viaBrochettes || viaMitraillette) {
        nextRoute = "Supplements?viaSauces=true";
    } else {
        nextRoute = "/nouvelle_commande";
    }
    if (isMenu) {
        nextRoute += "&menu=true";
    }
    router.push(nextRoute);
};

  return (
    <div className="font-bold style-pen text-lg mb-5 mt-2">
      <h1 className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">Sauces *</h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        {(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) ? (
          <p className="text-sm text-white mb-5 mt-auto">* Sauce gratuite</p>
        ) : viaFrites ? (
          <p className="text-sm text-white mb-5 mt-auto">* La première sauce gratuite puis 0.50€ l'unité</p>
        ) : viaAperoBox ? (
          <p className="text-sm text-white mb-5 mt-auto">* La première sauce gratuite puis 0.50€ l'unité sauf pour Party Box (deux sauces gratuites)</p>
        ) : (
          <p className="text-sm text-white mb-5 mt-auto">* Sauces à 0.50€ l'unité</p>
        )}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.Sauces
          .filter(sauce =>
            (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) || sauce.name !== "Aucune sauce"
          ).map((sauce) => (
            <div
              key={sauce.id}
              className={`relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md ${
                // En mode via classique (hors viaAperoBox), on affiche la sélection en un clic
                (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) && selectedSauce === sauce.id ? "bg-green-200 border-green-500" : ""
              }`}
              onClick={() => handleSelectSauce(sauce)}
            >
              <Image src={sauce.image} alt={sauce.name} width={150} height={150} className="object-contain mb-auto" />
              <div className={`absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black ${!(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) ? 'rounded-b-lg' : 'absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg'}`}>
                <p className="text-sm mt-auto">{sauce.name}</p>
                {/* {!(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) && <p className="text-sm mt-auto">{parseFloat(sauce.price)}€</p>} */}
                {!(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) && (
                  <div className="flex flex-row items-center gap-4">
                    <button onClick={() => handleDecrement(sauce.id)} className="text-sm bg-red-500 focus:ring-4 rounded-lg ml-auto px-8 py-2">-</button>
                    <span className="text-sm">{quantities[sauce.id]}</span>
                    <button onClick={() => handleIncrement(sauce.id)} className="text-sm bg-green-500 focus:ring-4 rounded-lg mr-auto px-8 py-2">+</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5" onClick={handleAddToCart}>Valider</button>
      </div>
    </div>
  );
};

export default Sauces;
