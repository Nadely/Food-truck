"use client";

import { useCart } from "/src/app/context/CartContext.tsx";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import dataProduits from "/src/data/dataProduits.json";

const Panier = () => {
  const { cart, removeFromCart, updateQuantity, setCart, remove } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [currentRelatedId, setCurrentRelatedId] = useState<string | null>(null);
  const [availableOptions, setAvailableOptions] = useState<
    { id: number; name: string; image: string; price?: number; uniqueId?: string }[]
  >([]);

  const isNouvelleCommande = () => pathname === "/nouvelle_commande";

  const cleanPrice = (priceString: string | number) => {
    if (!priceString) return 0;
    return parseFloat(priceString.toString().replace("€", "").replace(",", "."));
  };

  // Calcul total en tenant compte des quantités et prix des relatedItems *quantité*
  const total = cart.reduce((acc, item) => {
    const itemPrice = item.price || 0;
    const quantity = item.quantity || 1;

    // Somme des relatedItems * quantité du parent
    const relatedItemsTotal = item.relatedItems
      ? item.relatedItems.reduce((sum, related) => {
          const relatedPrice = related.price || 0;
          return sum + relatedPrice;
        }, 0)
      : 0;

    return acc + (itemPrice + relatedItemsTotal) * quantity;
  }, 0);

  const handleTransferCommandes = async () => {
    try {
      const cleanedPrice = cleanPrice(total.toFixed(2) + "€");
      console.log("Données envoyées à l'API :", {
        items: cart,
        user_name: "", // Remplacer
        user_image: "URL Image", // Remplacer
        time: "12:00", // Remplacer
        date: "2025-02-24", // Remplacer
        lieu: "Adresse", // Remplacer
        price: cleanedPrice + "€",
      });

      const response = await fetch("/api/panier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          user_name: "",
          user_image: "URL Image",
          time: "12:00",
          date: "2025-02-24",
          lieu: "Adresse",
          price: cleanedPrice + "€",
        }),
      });

      if (response.ok) {
        setCart([]);
        setRefreshKey((prev) => prev + 1);
      } else {
        const data = await response.json();
        console.error("Erreur:", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [cart]);

  const handleModify = (relatedId: string, parentId: string) => {
    setCurrentParentId(parentId);
    setCurrentRelatedId(relatedId);

    const baseItem = cart.find((item) => item.uniqueId === parentId);
    if (!baseItem) return;

    const allProducts = Object.values(dataProduits).flat();

    const relatedProduct = baseItem.relatedItems.find(
      (rel) => rel.uniqueId === relatedId
    );
    if (!relatedProduct) return;

    const baseName = relatedProduct.name;

    const fullProductData = allProducts.find(
      (prod) => prod.name.trim().toLowerCase() === baseName.trim().toLowerCase()
    );

    const rawCategorie = baseItem?.categorie || fullProductData?.categorie;

    const categoriesCibles = [
      "sauces",
      "snacks",
      "menu_enfants",
      "snacks veggies",
      "supplements",
      "boissons",
    ];

    let options = [];

    if (typeof rawCategorie === "string") {
      const normalizedCategorie = rawCategorie.trim().toLowerCase();

      if (categoriesCibles.includes(normalizedCategorie)) {
        options = allProducts
          .filter(
            (product) =>
              typeof product.categorie === "string" &&
              product.categorie.trim().toLowerCase() === normalizedCategorie
          )
          .map(({ id, name, image, price, uniqueId }) => ({
            id,
            name,
            image,
            uniqueId,
          }));
      } else {
        options = allProducts.map(({ id, name, image, price, uniqueId }) => ({
          id,
          name,
          image,
          uniqueId,
        }));
      }
    } else {
      options = allProducts.map(({ id, name, image, price, uniqueId }) => ({
        id,
        name,
        image,
        uniqueId,
      }));
    }

    setAvailableOptions(options);
    setIsPopupOpen(true);
  };

  const handleRemoveGarniture = (relatedId: string, parentId: string) => {
    const updatedCart = cart.map((item) => {
      if (item.uniqueId === parentId) {
        return {
          ...item,
          relatedItems: item.relatedItems.filter(
            (related: any) => related.uniqueId !== relatedId
          ),
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  return (
    <div key={refreshKey} className="flex flex-col h-screen">
      <div className="flex-grow">
        <h2 className="flex text-xl items-center justify-center style-pen border-b-2 border-black mb-4">
          Panier
        </h2>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul>
            {cart
             .map((item) => (
              <li key={item.uniqueId} className="flex flex-col mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {item.name === "Menu Enfants" ? (
                      <Image
                        src="/Enfants.png"
                        alt={item.name || "Menu enfant"}
                        width={40}
                        height={40}
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      item.image &&
                      item.name && (
                        <Image
                          src={item.image}
                          alt={item.name || ""}
                          width={40}
                          height={40}
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                          className="object-cover rounded-full"
                        />
                      )
                    )}
                    <p className="style-pen ml-2">
                      {item.categorie === "Enfants" ? item.categorie : item.name}
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
                  {cleanPrice( item.price) > 0 && (
                    <p>Prix unitaire : {item.price.toFixed(2)}€</p>
                  )}
                  {item.quantity > 1 && <p>Quantite : {item.quantity}</p>}
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
                            style={{ width: 40, height: 40, objectFit: "cover" }}
                            className="object-cover rounded-full"
                          />
                          <span className="ml-2">
                            {related.name ? `- ${related.name}` : "- Produit sans nom"}
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
                                handleRemoveGarniture(related.uniqueId, item.uniqueId)
                              }
                              className="border-2 border-red-500 text-red-700 px-2 rounded-full ml-2"
                            >
                              X
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

      {/* Popup pour modifier les garnitures */}
      {isPopupOpen && currentParentId && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl mb-4">Modifier garniture</h3>
            <ul>
              {availableOptions.map((option) => (
                <li key={option.id} className="flex items-center mb-2">
                  <Image
                    src={option.image}
                    alt={option.name}
                    width={40}
                    height={40}
                    style={{ width: 40, height: 40, objectFit: "cover" }}
                    className="object-cover rounded-full"
                  />
                  <span className="ml-2 flex-grow">{option.name}</span>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      const updatedCart = cart.map((item: any) => {
                        if (item.uniqueId === currentParentId) {
                          // Remplacer la garniture avec uniqueId == currentRelatedId
                          const updatedRelatedItems = item.relatedItems.map((related: any) =>
                            related.uniqueId === currentRelatedId
                              ? {
                                  uniqueId: option.uniqueId, // nouveau uniqueId
                                  id: option.id,
                                  name: option.name,
                                  image: option.image,
                                  price: option.price || 0,
                                }
                              : related
                          );
                          return { ...item, relatedItems: updatedRelatedItems };
                        }
                        return item;
                      });

                      setCart(updatedCart);
                      setIsPopupOpen(false);
                      setCurrentParentId(null);
                      setCurrentRelatedId(null);
                    }}
                    >
                      Selectionner
                    </button>

                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                setIsPopupOpen(false);
                setCurrentParentId(null);
              }}
              className="mt-4 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-black p-4 z-10 flex flex-col items-center">
            <p className="text-xl font-bold mb-2">
              Total : {total.toFixed(2)}€
            </p>
            {isNouvelleCommande() && (
              <button
                className="bg-yellow-100 border-2 border-black rounded-md px-6 py-2 bg-opacity-80"
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
