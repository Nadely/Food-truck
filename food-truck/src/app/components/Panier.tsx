"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

const Panier = () => {
  const { cart, removeFromCart, updateQuantity, setCart, remove } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Vérifie si la route active est "/nouvelle_commande"
  const isNouvelleCommande = () => pathname === "/nouvelle_commande";

  // Fonction pour nettoyer les prix sous forme de chaîne (ex: "10,00€")
  const cleanPrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(
      priceString.toString().replace("€", "").replace(",", ".")
    );
  };

  // Calcul du total en tenant compte des quantités et relatedItems
  const total = cart.reduce((acc, item) => {
    const itemPrice = item.price || 0;
    const itemTotal = itemPrice * (item.quantity || 1);

    const relatedItemsTotal = item.relatedItems
      ? item.relatedItems.reduce((sum, related) => {
          const relatedPrice = related.price || 0;
          return sum + relatedPrice;
        }, 0)
      : 0;

    return acc + itemTotal + relatedItemsTotal;
  }, 0);

  // Simule l'envoi de la commande (à personnaliser selon ton backend)
  const handleTransferCommandes = async () => {
    try {
      const cleanedTotal = cleanPrice(total.toFixed(2) + "€");
      console.log("Données envoyées à l'API :", {
        items: cart,
        total: cleanedTotal,
      });
      // Ici tu peux faire un fetch() vers ton backend
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande :", error);
    }
  };

  // Fonctions fictives pour éviter les erreurs
  const handleModify = (relatedId, parentId) => {
    console.log("Modifier :", relatedId, "de", parentId);
    // Rediriger ou modifier selon logique de ton projet
  };

  const handleRemoveGarniture = (relatedId, parentId) => {
    const updatedCart = cart.map((item) => {
      if (item.uniqueId === parentId) {
        return {
          ...item,
          relatedItems: item.relatedItems.filter(
            (related) => related.uniqueId !== relatedId
          ),
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <h2 className="flex text-xl items-center justify-center style-pen border-b-2 border-black mb-4">
          Panier
        </h2>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.uniqueId} className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {item.name === "Menu Enfants" ? (
                      <Image
                        src="/Enfants.png"
                        alt={item.name || "Menu enfant"}
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      item.image && item.name && (
                        <Image
                          src={item.image}
                          alt={item.name || ""}
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                        />
                      )
                    )}
                    <p className="style-pen ml-2">
                      {item.categorie === "Enfants"
                        ? item.categorie
                        : item.name}
                    </p>
                  </div>
                  {item.name &&
                  ["Mitraillette", "Burger", "Veggie", "Enfants"].some((kw) =>
                    item.name.includes(kw)
                  ) ? (
                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="bg-red-500 text-white px-2 rounded ml-4"
                    >
                      Supprimer
                    </button>
                  ) : (
                    (!item.relatedItems || item.relatedItems.length === 0) && (
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.uniqueId,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateQuantity(item.uniqueId, item.quantity + 1)
                          }
                          className="bg-green-500 text-white px-2 rounded ml-2"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(item.uniqueId)}
                          className="bg-black text-white px-2 rounded ml-4"
                        >
                          Supprimer
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="ml-4 text-sm text-black">
                  {item.price && item.price > 0 ? (
                    <p>Prix unitaire : {item.price.toFixed(2)}€</p>
                  ) : null}
                  {item.quantity > 1 && <p>Quantité : {item.quantity}</p>}
                  {item.relatedItems && item.relatedItems.length > 0 && (
                    <ul className="ml-4">
                      {item.relatedItems.map((related) => (
                        <li
                          key={related.uniqueId || related.id}
                          className="flex items-center text-black"
                        >
                          <Image
                            src={related.image}
                            alt={related.name || ""}
                            width={40}
                            height={40}
                            className="object-cover rounded-full"
                          />
                          <span className="ml-2">
                            {related.name
                              ? `- ${related.name}`
                              : "- Produit sans nom"}
                          </span>
                          {!related.isGarniture && !related.isFrites && (
                            <button
                              className="border-2 border-yellow-500 text-black px-2 rounded-full ml-5"
                              onClick={() =>
                                handleModify(related.uniqueId, item.uniqueId)
                              }
                            >
                              Modifier
                            </button>
                          )}
                          {related.isGarniture && (
                            <button
                              onClick={() =>
                                handleRemoveGarniture(
                                  related.uniqueId,
                                  item.uniqueId
                                )
                              }
                              className="border-2 border-red-500 px-2 rounded-full ml-5"
                            >
                              <Image
                                src="/poubelle.png"
                                alt="Supprimer"
                                width={15}
                                height={15}
                                className="rounded-full"
                              />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Bloc total et bouton Valider */}
      <div className="flex flex-col items-center justify-center mt-auto">
        <p className="text-lg">
          Total du panier : {parseFloat(total.toFixed(2))}€
        </p>
        {isNouvelleCommande() && (
          <button
            className="bg-yellow-100 border-2 border-black rounded-md bg-opacity-80 w-40 mt-2 mb-5"
            onClick={async () => {
              await handleTransferCommandes();
              router.push("/horaires");
            }}
          >
            Valider
          </button>
        )}
      </div>
    </div>
  );
};

export default Panier;
