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
    { id: number; name: string; image: string; price?: number; uniqueId?: string; categorie?: string }[]
  >([]);

  const isNouvelleCommande = () => pathname === "/nouvelle_commande";

  const cleanPrice = (priceString: string | number) => {
    if (!priceString) return 0;
    return parseFloat(priceString.toString().replace("€", "").replace(",", "."));
  };

  const total = cart.reduce((acc, item) => {
    const itemPrice = cleanPrice(item.price || 0);
    const quantity = item.quantity || 1;

    const relatedItemsTotal = Array.isArray(item.relatedItems)
      ? item.relatedItems.reduce((sum, related) => {
          if (related.name === "Aucun supplément") return sum;
          return sum + cleanPrice(related.price || 0);
        }, 0)
      : 0;

    return acc + (itemPrice + relatedItemsTotal) * quantity;
  }, 0);

  const handleTransferCommandes = async () => {
    try {
      const cleanedPrice = cleanPrice(total.toFixed(2) + "€");
      const payload = {
        items: cart,
        user_name: "",
        user_image: "URL Image",
        time: "12:00",
        date: "2025-02-24",
        lieu: "Adresse",
        price: cleanedPrice + "€",
      };

      const response = await fetch("/api/panier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const isMenuEnfants = baseItem.name?.toLowerCase().includes("menu enfants");

    let options = [];

    if (typeof rawCategorie === "string") {
      const normalizedCategorie = rawCategorie.trim().toLowerCase();

      // Pour les boissons et suppléments, on montre tous les produits de ces catégories
      if (normalizedCategorie.includes("boissons") || normalizedCategorie.includes("supplements")) {
        options = allProducts
          .filter(
            (product) =>
              typeof product.categorie === "string" &&
              (product.categorie.toLowerCase().includes("boissons") ||
               product.categorie.toLowerCase().includes("supplements"))
          )
          .map(({ id, name, image, price, uniqueId }) => ({
            id,
            name,
            image,
            price: cleanPrice(price),
            uniqueId,
          }));
      } else {
        options = allProducts.map(({ id, name, image, price, uniqueId }) => ({
          id,
          name,
          image,
          price: cleanPrice(price),
          uniqueId,
        }));
      }
    } else {
      options = allProducts.map(({ id, name, image, price, uniqueId }) => ({
        id,
        name,
        image,
        price: cleanPrice(price),
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
        <h2 className="text-xl text-center style-pen border-b-2 border-black mb-4">Panier</h2>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul>
            {cart.map((item: any) => (
              <li key={item.uniqueId} className="mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {(!item.relatedItems || item.relatedItems.length === 0) && (
                      <Image
                        src={item.name === "Menu Enfants" ? "/Enfants.png" : item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-contain bg-white"
                      />
                    )}
                    <p className="ml-2 style-pen">{item.categorie === "Enfants" ? item.categorie : item.name}</p>
                  </div>
                  {["Mitraillette", "Burger", "Veggie", "Enfants"].some((kw) => item.name?.includes(kw)) ? (
                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Supprimer
                    </button>
                  ) : (
                    (!item.relatedItems || item.relatedItems.length === 0) && (
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.uniqueId, Math.max(1, item.quantity - 1))}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                          className="bg-green-500 text-white px-2 ml-2 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(item.uniqueId)}
                          className="bg-black text-white px-2 ml-4 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="ml-4 text-sm">
                  {cleanPrice(item.price) > 0 && <p>Prix unitaire : {item.price.toFixed(2)}€</p>}
                  {item.quantity > 1 && <p>Quantité : {item.quantity}</p>}
                  {item.relatedItems?.length > 0 && (
                    <ul className="ml-4 mt-2">
                      {item.relatedItems.map((related) => (
                        <li key={related.uniqueId} className="flex items-center mb-1">
                          <div className="w-8 h-8 relative">
                            <Image
                              src={related.image}
                              alt={related.name || ""}
                              fill
                              className="object-contain bg-white rounded-full"
                            />
                          </div>
                          <span className="ml-2">
                            - {related.name}
                          </span>
                          {(!related.isGarniture && !related.isFrites) || related.isBoisson ? (
                            <button
                              onClick={() => handleModify(related.uniqueId, item.uniqueId)}
                              className="border-2 border-yellow-500 text-black px-2 ml-5 rounded-full"
                            >
                              Modifier
                            </button>
                          ) : null}
                          {related.isGarniture && (
                            <button
                              onClick={() => handleRemoveGarniture(related.uniqueId, item.uniqueId)}
                              className="border-2 border-red-500 text-red-700 px-2 ml-2 rounded-full"
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
                  <div className="w-10 h-10 relative">
                    <Image
                      src={option.image}
                      alt={option.name}
                      fill
                      className="object-contain bg-white rounded-full"
                    />
                  </div>
                  <span className="ml-2 flex-grow">{option.name}</span>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      const updatedCart = cart.map((item) => {
                        if (item.uniqueId === currentParentId) {
                          const updatedRelatedItems = item.relatedItems.map((related: any) => {
                            if (related.uniqueId === currentRelatedId) {
                              const relatedCategorie = related.categorie?.toLowerCase() || "";
                              const optionCategorie = option.categorie?.toLowerCase() || "";
                              const isBoissonOrSupp =
                                relatedCategorie.includes("boissons") ||
                                relatedCategorie.includes("supplements") ||
                                optionCategorie.includes("boissons") ||
                                optionCategorie.includes("supplements");

                              // Gestion spéciale pour les suppléments et boissons
                              let prixFinal = 0;
                              if (isBoissonOrSupp) {
                                if (option.name === "Aucuns supplements") {
                                  prixFinal = 0;
                                  return {
                                    ...option,
                                    price: 0,
                                    categorie: "supplements",
                                    uniqueId: `supplements-none-${Date.now()}`
                                  };
                                } else {
                                  const isMenu = ["menu enfants", "mitraillettes", "burgers", "veggies"].some((kw) =>
                                    item.name?.toLowerCase().includes(kw)
                                  );

                                  if (optionCategorie.includes("boissons")) {
                                    if (isMenu) {
                                      if (option.name.toLowerCase().includes("leffe")) {
                                        prixFinal = 3.5;
                                      } else {
                                        prixFinal = 1;
                                      }
                                    } else {
                                      prixFinal = cleanPrice(option.price || 0);
                                    }
                                  } else {
                                    prixFinal = cleanPrice(option.price || 0);
                                  }
                                }
                              } else {
                                prixFinal = cleanPrice(option.price || 0);
                              }

                              return {
                                ...related,
                                ...option,
                                price: prixFinal,
                                categorie: related.categorie || option.categorie,
                                isBoisson: optionCategorie.includes("boissons")
                              };
                            }
                            // Si c'est un autre supplément et qu'on a sélectionné "Aucun supplément", on le supprime
                            if (option.name === "Aucuns supplements" && related.categorie?.toLowerCase().includes("supplements")) {
                              return null;
                            }
                            return related;
                          }).filter(Boolean);

                          // Si "Aucun supplément" est sélectionné, s'assurer qu'il n'y a qu'un seul élément
                          const finalRelatedItems = option.name === "Aucuns supplements"
                            ? updatedRelatedItems.filter(item => item.name === "Aucuns supplements").slice(0, 1)
                            : updatedRelatedItems;

                          // Calculer le nouveau prix total des relatedItems
                          const newTotalPrice = finalRelatedItems.reduce((sum: number, related: any) => {
                            return sum + cleanPrice(related.price || 0);
                          }, 0);

                          const updatedItem = {
                            ...item,
                            relatedItems: finalRelatedItems,
                            price: newTotalPrice
                          };

                          // Forcer le rafraîchissement du panier
                          setCart(prevCart => {
                            const newCart = prevCart.map(cartItem =>
                              cartItem.uniqueId === currentParentId ? updatedItem : cartItem
                            );
                            return newCart;
                          });
                          setRefreshKey(prev => prev + 1);
                          setIsPopupOpen(false);
                          setCurrentParentId(null);
                          setCurrentRelatedId(null);
                          return updatedItem;
                        }
                        return item;
                      });
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
        <p className="text-xl font-bold mb-2">Total : {total.toFixed(2)}€</p>
        {isNouvelleCommande() && (
          <button
            className="bg-yellow-100 border-2 border-black rounded-md px-6 py-2 bg-opacity-80"
            onClick={async () => {
              await handleTransferCommandes();
              router.push("/horaire-livraison"); // <-- ajuste ce chemin selon ta navigation
            }}
          >
            Commander
          </button>
        )}
      </div>
    </div>
  );
};

export default Panier;
