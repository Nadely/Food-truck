"use client";

import React from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";


const Panier = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // Calcul du total global
  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

   // Supprimer une garniture spécifiquement sans toucher au produit principal
   const handleRemoveGarniture = (garnitureId, parentProductId) => {
    // Trouver l'élément parent (le produit de base)
    const parentItem = cart.find(item => item.id === parentProductId);

    if (parentItem) {
      // Filtrer les garnitures et supprimer celle qui a l'id correspondant
      parentItem.relatedItems = parentItem.relatedItems.filter(
        item => item.id !== garnitureId
      );

      // Mettre à jour le panier avec les garnitures filtrées
      updateQuantity(parentProductId, parentItem.quantity);  // Mise à jour si nécessaire
    }
  };

  return (
    <div>
      <h2 className="flex text-xl items-center justify-center font-bold border-b-2 border-black mb-4">
        Panier
      </h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cart.map((item) => {
          console.log(item);
          console.log(item.relatedItems); // Vérifie ce qui est contenu dans chaque item du panier
          return (
            <li key={item.id} className="flex justify-between items-center mb-4">
              {/* Affichage des produits */}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                {item.price > 0 ? `Prix unitaire : ${parseFloat(item.price || 0).toFixed(2)}€` : ""}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-600">
                    Quantité : {item.quantity}
                  </p>
                )}

                {/* Affichage des produits associés */}
                {item.relatedItems && item.relatedItems.length > 0 && (
                  <ul className="ml-4 text-sm">
                    {item.relatedItems.map((related, index) => (
                      <li key={index} className="text-gray-600">
                        {related.name ? `- ${related.name}` : "- Produit sans nom"}

                        {/* Si c'est une garniture, afficher le bouton supprimer */}
                        {related.isGarniture && (
                          <button
                            onClick={() => handleRemoveGarniture(related.id, item.id)}
                            className="bg-gray-500 text-white px-2 rounded ml-2"
                          >
                            Supprimer
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Actions pour ajuster la quantité ou supprimer le produit principal */}
              <div>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  -
                </button>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-green-500 text-white px-2 rounded ml-2"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-gray-500 text-white px-2 rounded ml-4"
                >
                  Supprimer
                </button>
              </div>
            </li>
          );
        })}
        </ul>
      )}

      {/* Affichage du total global */}
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Total du panier : {total.toFixed(2)}€</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          className="button-blue w-40 mt-10 mb-5"
          onClick={() => router.push("/panier")}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Panier;
