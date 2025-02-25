"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Panier = () => {
  const { cart, removeFromCart, updateQuantity, setCart } = useCart();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const total = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  console.log("Nous voulons le total de", total);
  console.log(typeof total);

  const cleanPrice = (price: string) => {
    // Enlever l'euro, les espaces et convertir en nombre
    const cleanedPrice = price.replace("€", "").replace(",", ".").trim();
    const numericPrice = parseFloat(cleanedPrice);

    if (isNaN(numericPrice)) {
        console.error("Erreur de conversion du prix:", price);
    }

    return numericPrice;
  };

  const handleTransferCommandes = async () => {
    try {
      // Nettoyer le total avant l'envoi
      const cleanedPrice = cleanPrice(total.toFixed(2) + "€");
      console.log("Données envoyées à l'API :", {
        items: cart,
        user_name: "", // À remplacer par la vraie valeur
        user_image: "URL Image", // À remplacer par la vraie valeur
        time: "12:00", // À remplacer par la vraie valeur
        date: "2025-02-24", // À remplacer par la vraie valeur
        lieu: "Adresse", // À remplacer par la vraie valeur
        price: cleanedPrice + "€", // Utiliser le prix nettoyé
      });

      const response = await fetch("/api/panier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Assurez-vous que le corps de la requête est correctement formaté
          body: JSON.stringify({
            items: cart,
            user_name: "",
            user_image: "URL Image",
            time: "12:00",
            date: "2025-02-24",
            lieu: "Adresse",
            price: cleanedPrice + "€",
          }),
        },
      });

      if (response.ok) {
        setCart([]);
        setRefreshKey((prevKey) => prevKey + 1);
      } else {
        const data = await response.json();
        console.error("Erreur:", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [cart]);

  const handleRemoveGarniture = (garnitureUniqueId: string, parentUniqueId: string) => {
    setCart((prevCart) => {
      return prevCart.map((item: any) => {
        if (item.uniqueId === parentUniqueId) {
          return {
            ...item,
            relatedItems: item.relatedItems?.filter(
              (related: any) => related.uniqueId !== garnitureUniqueId
            ) || [],
          };
        }
        return item;
      });
    });
  };

  return (
    <div key={refreshKey}>
      <h2 className="flex text-xl items-center justify-center font-bold border-b-2 border-black mb-4">
        Panier
      </h2>
      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.uniqueId} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">
                  {item.categorie === "Enfants" ? item.categorie : item.name}
                </p>
                <p className="text-sm text-gray-600">
                  {item.price && item.price > 0 ? `Prix unitaire : ${item.price.toFixed(2)}€` : ""}
                </p>
                {item.quantity > 1 && (
                  <p className="text-sm text-gray-600">Quantité : {item.quantity}</p>
                )}

                {/* Afficher les relatedItems avec leurs boutons de suppression, mais pas pour le produit principal */}
                {item.relatedItems && item.relatedItems.length > 0 && (
                  <ul className="ml-4 text-sm">
                    {item.relatedItems.map((related, index) => (
                      <li key={index} className="text-gray-600">
                        {related.name ? `- ${related.name}` : "- Produit sans nom"}

                        {related.isGarniture && (
                          <button
                            onClick={() => handleRemoveGarniture(related.uniqueId, item.uniqueId)}
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

              {/* Afficher le bouton "Supprimer" pour les produits */}
              {item.categorie && ["Mitraillettes", "Burgers", "Veggies", "Enfants"].includes(item.categorie) || item.relatedItems ? (
                <div>
                  <button
                    onClick={() => removeFromCart(item.uniqueId)}
                    className="bg-gray-500 text-white px-2 rounded ml-4"
                  >
                    Supprimer
                  </button>
                </div>
              ) : null}

              {!item.relatedItems && (
                <div>
                  <button
                    onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                    className="bg-red-500 text-white px-2 rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                    className="bg-green-500 text-white px-2 rounded ml-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.uniqueId)}
                    className="bg-gray-500 text-white px-2 rounded ml-4"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </li>
          ))}

        </ul>
      )}
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Total du panier : {parseFloat(total.toFixed(2))}€</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          className="button-blue w-40 mt-10 mb-5"
          onClick={async () => {
            await handleTransferCommandes();
            router.push("/horaires");
          }}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Panier;
