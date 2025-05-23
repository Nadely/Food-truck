"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const Sauces = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Récupération des paramètres via
  const viaSnacks = searchParams.get("viaSnacks") === "true";
  const viaSnacksVeggies = searchParams.get("viaSnacksVeggies") === "true";
  const viaEnfants = searchParams.get("viaEnfants") === "true";
  const viaBrochettes = searchParams.get("viaBrochettes") === "true";
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const viaAperoBox = searchParams.get("viaAperoBox") === "true";
  const viaFrites = searchParams.get("viaFrites") === "true";
  const isMenu = searchParams.get("menu") === "true";
  const groupId = searchParams.get("groupId");

  if (!groupId && (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette)) {
    console.error("groupId manquant dans les paramètres d'URL");
    router.push("/nouvelle_commande");
    return null;
  }

  // Détection du mode multi-sélection
  const isMultiSelect = viaFrites || viaAperoBox;

  // Calcul des sauces gratuites
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

  // États locaux
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.Sauces.reduce((acc, sauce) => {
      acc[sauce.id] = 0;
      return acc;
    }, {} as { [key: number]: number })
  );

  const [selectedSauce, setSelectedSauce] = useState<number[] | number | null>(
    isMultiSelect ? [] : null
  );

  // Gestion des quantités
  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  // Sélection simple ou multiple (clic)
  const handleSelectSauce = (sauce: any) => {
    if (isMultiSelect) {
      setSelectedSauce((prevSelected) => {
        if (Array.isArray(prevSelected)) {
          return prevSelected.includes(sauce.id)
            ? prevSelected.filter((id) => id !== sauce.id)
            : [...prevSelected, sauce.id];
        }
        return [sauce.id];
      });
    } else if (
      viaSnacks ||
      viaSnacksVeggies ||
      viaEnfants ||
      viaBrochettes ||
      viaMitraillette
    ) {
      setSelectedSauce(sauce.id);
    }
  };


// Validation
const handleAddToCart = () => {
  const isVia =
    viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaFrites || viaAperoBox;

  if (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) {
    if (selectedSauce !== null) {
      const sauce = data.Sauces.find((item) => item.id === selectedSauce);
      if (sauce) {
        addToCart({
          id: sauce.id,
          name: sauce.name,
          image: sauce.image,
          price: 0,
          quantity: 1,
          uniqueId: `sauce-${sauce.id}-${Date.now()}`,
          groupId: groupId,
          relatedItems: [{
            id: sauce.id,
            name: sauce.name,
            image: sauce.image,
            price: 0,
            quantity: 1,
            uniqueId: `sauce-${sauce.id}-${Date.now()}-related`,
            groupId: groupId
          }]
        });
      }
    }
  } else {
    const selectedSauces = data.Sauces
      .filter((sauce) => selectedSauce?.includes?.(sauce.id) || quantities[sauce.id] > 0)
      .map((sauce) => {
        const quantity = quantities[sauce.id];
        if (quantity > 0 || selectedSauce?.includes?.(sauce.id)) {
          return {
            id: sauce.id,
            name: sauce.name,
            image: sauce.image,
            quantity: quantity > 0 ? quantity : 1,
            groupId: groupId
          };
        }
        return null;
      })
      .filter(Boolean);

    const flatSauces = [];

    selectedSauces.forEach((sauce) => {
      for (let i = 0; i < sauce.quantity; i++) {
        flatSauces.push({
          id: sauce.id,
          name: sauce.name,
          image: sauce.image,
          groupId: groupId
        });
      }
    });

    const finalSauces = flatSauces.map((sauce, index) => ({
      ...sauce,
      price: index < freeSauces ? 0 : 0.5,
      groupId: groupId
    }));

    const grouped = {};

    finalSauces.forEach((sauce) => {
      if (!grouped[sauce.id]) {
        grouped[sauce.id] = {
          quantity: 1,
          totalPrice: sauce.price,
          price: sauce.price,
          groupId: groupId
        };
      } else {
        grouped[sauce.id].quantity += 1;
        grouped[sauce.id].totalPrice += sauce.price;
      }
    });

    Object.entries(grouped).forEach(([id, info]) => {
      const sauceData = data.Sauces.find((s) => s.id === parseInt(id));
      if (sauceData) {
        if (isVia) {
          addToCart({
            uniqueId: `sauce-${sauceData.id}-${Date.now()}`,
            id: sauceData.id,
            quantity: info.quantity,
            price: info.price,
            totalPrice: info.totalPrice,
            relatedItems: [{
              id: sauceData.id,
              name: sauceData.name,
              image: sauceData.image,
              groupId: groupId
            }],
            groupId: groupId
          });
        } else {
          addToCart({
            uniqueId: `sauce-${sauceData.id}-${Date.now()}`,
            id: sauceData.id,
            name: sauceData.name,
            image: sauceData.image,
            quantity: info.quantity,
            price: info.price,
            totalPrice: info.totalPrice,
            groupId: groupId
          });
        }
      }
    });
  };

  // Redirection
  let nextRoute = (viaSnacks || viaSnacksVeggies || viaBrochettes || viaMitraillette)
    ? `Supplements?viaSauces=true&groupId=${groupId}`
    : "/nouvelle_commande";

  if (isMenu) {
    nextRoute += "&menu=true";
  }

  router.push(nextRoute);
};

  return (
    <div className="font-bold style-pen text-lg mb-5 mt-2">
      <h1 className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Sauces *
      </h1>

      <div className="w-full flex flex-col items-center justify-center mt-4 mb-5">
        {/* Message d'information */}
        <p className="text-sm text-white mb-5 mt-auto">
          {viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette
            ? "* Sauce gratuite"
            : viaFrites
            ? "* La première sauce gratuite puis 0.50€ l'unité"
            : viaAperoBox
            ? "* La première sauce gratuite puis 0.50€ l'unité sauf pour Party Box (deux sauces gratuites)"
            : "* Sauces à 0.50€ l'unité"}
        </p>

        {/* Affichage des sauces */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.Sauces.filter(
            (sauce) =>
              (viaSnacks ||
                viaSnacksVeggies ||
                viaEnfants ||
                viaBrochettes ||
                viaMitraillette ||
                viaAperoBox ||
                viaFrites) ||
              sauce.name !== "Aucune sauce"
          ).map((sauce) => (
            <div
              key={sauce.id}
              onClick={() => handleSelectSauce(sauce)}
              className={`relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition-transform duration-200 hover:scale-105 ${
                (Array.isArray(selectedSauce) && selectedSauce.includes(sauce.id) || sauce.id === selectedSauce) && (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaFrites || viaAperoBox || isMultiSelect)
                  ? "bg-green-200 border-green-500"
                  : ""
              }`}
            >
              <Image
                src={sauce.image}
                alt={sauce.name}
                width={150}
                height={150}
                className="object-contain mb-auto"
              />
              <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                <p className="text-sm">{sauce.name}</p>

                {/* Si mode non-via, afficher boutons +/- */}
                {!(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaAperoBox || viaFrites) && (
                  <div className="flex flex-row items-center justify-center gap-4 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(sauce.id);
                      }}
                      className="text-sm bg-red-500 text-white rounded-lg px-3 py-1"
                    >
                      -
                    </button>
                    <span>{quantities[sauce.id] > 0 ? quantities[sauce.id] : ""}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(sauce.id);
                      }}
                      className="text-sm bg-green-500 text-white rounded-lg px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de validation */}
        <button
          className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5 py-2"
          onClick={handleAddToCart}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Sauces;
