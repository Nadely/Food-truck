"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { dataProduits as data } from "../../../../data/db";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const SnacksVeggies = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { addToCart, addRelatedItemToGroup } = useCart();

  const viaVeggieMitraillette =
    searchParams.get("viaVeggieMitraillette") === "true";

  const isMenu = searchParams.get("menu") === "true";

  // On récupère le groupId de la mitraillette
  const groupId = searchParams.get("groupId");

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.SnacksVeggies.reduce(
      (acc: { [key: number]: number }, product) => {
        acc[product.id] = 0;
        return acc;
      },
      {}
    )
  );

  const [selectedSnackVeggie, setSelectedSnackVeggie] = useState<
    number | null
  >(null);

  const handleIncrement = (id: number) => {
    if (!viaVeggieMitraillette) {
      setQuantities((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));
    }
  };

  const handleDecrement = (id: number) => {
    if (!viaVeggieMitraillette) {
      setQuantities((prev) => ({
        ...prev,
        [id]: Math.max(prev[id] - 1, 0),
      }));
    }
  };

  const handleSelectSnack = (product: any) => {
    if (viaVeggieMitraillette) {
      setSelectedSnackVeggie(product.id);
    }
  };

  const handleAddToCart = () => {
    // =========================================================
    // PARCOURS VEGGIE MITRAILLETTE
    // =========================================================
    if (viaVeggieMitraillette) {
      if (selectedSnackVeggie === null) {
        console.error("Aucun Snack Veggie sélectionné");
        return;
      }

      if (!groupId) {
        console.error("groupId manquant");
        return;
      }

      const product = data.SnacksVeggies.find(
        (item) => item.id === selectedSnackVeggie
      );

      if (!product) {
        console.error("Snack Veggie introuvable");
        return;
      }

      console.log("Ajout du snack comme relatedItem");
      console.log("Snack :", product.name);
      console.log("groupId :", groupId);

      // IMPORTANT :
      // Le snack n'est PAS ajouté comme produit principal.
      // Il est ajouté dans relatedItems de la mitraillette.
      addRelatedItemToGroup(groupId, {
        id: product.id,
        name: product.name,
        image: product.image,
        price: 0,
        quantity: 1,
        groupId: groupId,
        isSnack: true,
      });

      router.push(
        `Sauces?viaSnacksVeggies=true&groupId=${groupId}${
          isMenu ? "&menu=true" : ""
        }`
      );

      return;
    }

    // =========================================================
    // PARCOURS NORMAL
    // =========================================================

    const newGroupId = `snacks-veggies-${Date.now()}`;

    const itemsToAdd = data.SnacksVeggies
      .map((product) => {
        const quantity = quantities[product.id];

        if (quantity > 0) {
          return {
            id: product.id,
            name: product.name,
            image: product.image,
            price: parseFloat(
              product.price.replace("€", "").replace(",", ".").trim()
            ),
            quantity,
          };
        }

        return null;
      })
      .filter(Boolean);

    if (itemsToAdd.length === 0) {
      console.error("Aucun Snack Veggie sélectionné");
      return;
    }

    itemsToAdd.forEach((item) => {
      if (item) {
        addToCart({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          groupId: newGroupId,
        });
      }
    });

    router.push(
      `Sauces?viaSnacksVeggies=true&groupId=${newGroupId}${
        isMenu ? "&menu=true" : ""
      }`
    );
  };

  return (
    <div className="text-black font-bold style-pen text-lg mb-5 mt-2">
      <div className="flex flex-col text-black items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Snacks Veggies
      </div>

      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 w-full max-w-[1200px]">
            {data.SnacksVeggies.filter(
              (product) =>
                viaVeggieMitraillette || product.name !== "Steack haché"
            ).map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 flex-grow basis-[180px] max-w-[220px] ${
                  viaVeggieMitraillette &&
                  selectedSnackVeggie === product.id
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rounded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                  onClick={() => handleSelectSnack(product)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                    <p className="text-sm mt-auto">
                      {product.name}
                    </p>

                    {/* Les + / - ne sont jamais affichés
                        pour le parcours Mitraillette */}
                    {!viaVeggieMitraillette && (
                      <div className="flex flex-row items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement(product.id);
                          }}
                          className="text-sm bg-red-500 focus:ring-4 rounded-lg px-8 py-2 ml-3"
                        >
                          -
                        </button>

                        <span className="text-sm">
                          {quantities[product.id]}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement(product.id);
                          }}
                          className="text-sm bg-green-500 focus:ring-4 rounded-lg px-8 py-2"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prix caché lorsque le snack est inclus
                    dans la Veggie Mitraillette */}
                {!viaVeggieMitraillette && (
                  <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-auto">
                    {product.price}
                  </p>
                )}
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
      </div>
    </div>
  );
};

export default SnacksVeggies;
