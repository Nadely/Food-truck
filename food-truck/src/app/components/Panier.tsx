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
    // Si l'item a des relatedItems qui sont des boissons, on ne compte pas son prix principal
    const hasBoisson = Array.isArray(item.relatedItems) && item.relatedItems.some(related => related.isBoisson);
    const itemPrice = hasBoisson ? 0 : cleanPrice(item.price || 0);
    const quantity = item.quantity || 1;

    const relatedItemsTotal = Array.isArray(item.relatedItems)
      ? item.relatedItems.reduce((sum, related) => {
          // Pour les boissons, on utilise leur prix normal
          if (related.isBoisson) {
            const isLeffe = related.name?.toLowerCase().includes('leffe');
            return sum + (isLeffe ? 3.5 : 1);
          }
          // Pour les suppléments, on compte 1€ chacun
          if (related.isSupplements) return sum + 1;
          // Pour les autres items, utiliser leur prix
          return sum + cleanPrice(related.price || 0);
        }, 0)
      : 0;

    return acc + (itemPrice + relatedItemsTotal) * quantity;
  }, 0);

  const handleTransferCommandes = async () => {
    try {
      const cleanedPrice = cleanPrice(total.toFixed(2) + "€");

      // Préparer les items avec leurs groupId
      const itemsWithGroupId = cart.map(item => {
        const groupId = item.groupId || `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          ...item,
          groupId,
          relatedItems: item.relatedItems?.map(related => ({
            ...related,
            groupId
          }))
        };
      });

      console.log("Items avec groupId:", itemsWithGroupId);

      const payload = {
        items: itemsWithGroupId,
        user_name: "",
        user_image: "URL Image",
        time: "12:00",
        date: "2025-02-24",
        lieu: "Adresse",
        price: cleanedPrice + "€",
      };

      console.log("Données envoyées au serveur:", payload);

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
    const isMenuEnfants = baseItem.name?.toLowerCase().includes("menu enfants");

    let options = [];

    if (isMenuEnfants) {
      // Dans le menu enfants, on ne montre que les produits de la catégorie Menu_Enfants
      options = allProducts
        .filter(
          (product) =>
            typeof product.categorie === "string" &&
            product.categorie.toLowerCase() === "menu_enfants"
        )
        .map(({ id, name, image, price, uniqueId }) => ({
          id,
          name,
          image,
          price: cleanPrice(price),
          uniqueId,
        }));
    } else {
      // En dehors du menu enfants, on cherche d'abord dans les catégories Snacks et Boissons
      const fullProductData = allProducts.find(
        (prod) =>
          prod.name.trim().toLowerCase() === baseName.trim().toLowerCase() &&
          (prod.categorie === "Snacks" || prod.categorie === "Boissons")
      );

      if (fullProductData?.categorie) {
        const normalizedCategory = fullProductData.categorie.toLowerCase();
        options = allProducts
          .filter(
            (product) =>
              typeof product.categorie === "string" &&
              product.categorie.toLowerCase() === normalizedCategory
          )
          .map(({ id, name, image, price, uniqueId }) => ({
            id,
            name,
            image,
            price: cleanPrice(price),
            uniqueId,
          }));
      } else {
        // Si on ne trouve pas dans Snacks ou Boissons, on cherche dans toutes les catégories
        const fullProductData = allProducts.find(
          (prod) => prod.name.trim().toLowerCase() === baseName.trim().toLowerCase()
        );

        if (fullProductData?.categorie) {
          const normalizedCategory = fullProductData.categorie.toLowerCase();
          options = allProducts
            .filter(
              (product) =>
                typeof product.categorie === "string" &&
                product.categorie.toLowerCase() === normalizedCategory
            )
            .map(({ id, name, image, price, uniqueId }) => ({
              id,
              name,
              image,
              price: cleanPrice(price),
              uniqueId,
            }));
        }
      }
    }

    setAvailableOptions(options);
    setIsPopupOpen(true);
  };

  const handleRemoveGarniture = (relatedId: string, parentId: string) => {
    const updatedCart = cart.map((item) => {
      if (item.uniqueId === parentId) {
        const updatedRelatedItems = item.relatedItems.filter(
          (related: any) => related.uniqueId !== relatedId
        );

        // Compter le nombre de suppléments restants
        const remainingSupplementsCount = updatedRelatedItems.filter(
          (related: any) => related.isSupplements
        ).length;

        // Mettre à jour le prix en fonction du nombre de suppléments
        const newPrice = remainingSupplementsCount;

        return {
          ...item,
          relatedItems: updatedRelatedItems,
          price: newPrice
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
                    <p className="ml-2 style-pen">
                      {item.categorie === "Enfants" ? "Menu Enfants" :
                       (item.relatedItems?.some(rel => rel.name === item.name) ? "" : item.name)}
                    </p>
                  </div>
                  {["Mitraillette", "Burger", "Veggie", "Enfants"].some((kw) => item.name?.includes(kw)) ? (
                    <button
                      onClick={() => {
                        console.log("Tentative de suppression du groupe:", item.groupId);
                        if (item.groupId) {
                          removeFromCart(item.groupId);
                        } else {
                          console.error("Pas de groupId trouvé pour l'élément:", item);
                        }
                      }}
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
                  {item.quantity > 1 && <p>Quantite : {item.quantity}</p>}
                  {item.relatedItems?.length > 0 && (
                    <>
                      {item.relatedItems.some(related => related.isSupplements) && (
                        <div className="mb-2">
                          <p>Quantite : {item.relatedItems.filter(related => related.isSupplements).length}</p>
                          <p>Prix unitaire : {dataProduits.Supplements[0].price}</p>
                        </div>
                      )}
                      <ul className="ml-4 mt-2">
                        {item.relatedItems.map((related, index) => (
                          <li key={`${related.uniqueId}-${index}`} className="flex items-center mb-1">
                            <div className="w-8 h-8 relative">
                              <Image
                                src={related.image}
                                alt=""
                                fill
                                className="object-contain bg-white rounded-full"
                              />
                            </div>
                            <span className="ml-2">
                              {related.name}
                              {related.isBoisson && related.price > 0 && (
                                <span className="ml-2 text-sm">
                                  ({related.price}€)
                                </span>
                              )}
                            </span>
                            {(!related.isGarniture && !related.isFrites) || related.isBoisson ? (
                              <button
                                onClick={() => handleModify(related.uniqueId, item.uniqueId)}
                                className="border-2 border-yellow-500 text-black px-2 ml-5 rounded-full"
                              >
                                Modifier
                              </button>
                            ) : null}
                            {(related.isGarniture ||
                              (related.isSupplements &&
                                item.relatedItems.filter(r => r.isSupplements).length > 1)
                            ) && (
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
                    </>
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
                              const relatedCategorie = related.categorie?.toLowerCase() || "boissons";
                              const optionCategorie = option.categorie?.toLowerCase() || "boissons";

                              console.log("Données complètes:", {
                                related,
                                option,
                                relatedCategorie,
                                optionCategorie
                              });

                              const isBoissonOrSupp =
                                relatedCategorie.includes("boissons") ||
                                relatedCategorie.includes("supplements") ||
                                optionCategorie.includes("boissons") ||
                                optionCategorie.includes("supplements") ||
                                option.name.toLowerCase().includes("leffe") ||
                                option.name.toLowerCase().includes("coca") ||
                                option.name.toLowerCase().includes("tropico") ||
                                option.name.toLowerCase().includes("ice tea");

                              console.log("Détection boisson/supplément:", {
                                relatedCategorie,
                                optionCategorie,
                                isBoissonOrSupp,
                                optionName: option.name
                              });

                              // Gestion spéciale pour les suppléments et boissons
                              let prixFinal = 0;
                              if (isBoissonOrSupp) {
                                if (option.name === "Aucuns supplements" || option.name === "Aucune boisson") {
                                  prixFinal = 0;
                                  console.log("Aucun supplément/boisson sélectionné");
                                  return {
                                    ...option,
                                    price: 0,
                                    categorie: option.name === "Aucune boisson" ? "boissons" : "supplements",
                                    uniqueId: `${option.name === "Aucune boisson" ? "boisson" : "supplements"}-none-${Date.now()}`
                                  };
                                } else {
                                  const isMenu = ["menu enfants", "mitraillettes", "burgers", "veggies"].some((kw) =>
                                    item.name?.toLowerCase().includes(kw)
                                  );

                                  console.log("Vérification du type de boisson:", {
                                    optionName: option.name,
                                    isMenu,
                                    optionCategorie
                                  });

                                  if (optionCategorie.includes("boissons") ||
                                      option.name.toLowerCase().includes("leffe") ||
                                      option.name.toLowerCase().includes("coca") ||
                                      option.name.toLowerCase().includes("tropico") ||
                                      option.name.toLowerCase().includes("ice tea")) {
                                    if (option.name.toLowerCase().includes("leffe")) {
                                      prixFinal = 3.5;
                                      console.log("Boisson détectée : Leffe → Prix = 3.5€");
                                    } else {
                                      prixFinal = 1;
                                      console.log("Boisson détectée (autre que Leffe) → Prix = 1€");
                                    }
                                  } else {
                                    prixFinal = 0;
                                    console.log("Ce n'est pas une boisson → Prix = 0€");
                                  }
                                }
                              }

                              return {
                                ...related,
                                ...option,
                                price: prixFinal,
                                categorie: "boissons",
                                isBoisson: true,
                                displayPrice: prixFinal + "€"
                              };
                            }
                            return related;
                          }).filter(Boolean);

                          // Si "Aucun supplément" est sélectionné, s'assurer qu'il n'y a qu'un seul élément
                          const finalRelatedItems = option.name === "Aucune sauce"
                            ? updatedRelatedItems.filter(item => item.name === "Aucune sauce").slice(0, 1)
                            : updatedRelatedItems.filter(item => item.name !== "Aucune sauce");

                          // Calculer le nouveau prix total des relatedItems
                          const newTotalPrice = finalRelatedItems.reduce((sum: number, related: any) => {
                            if (related.name === "Aucune sauce") return sum;
                            return sum + cleanPrice(related.price || 0);
                          }, 0);

                          const updatedItem = {
                            ...item,
                            relatedItems: finalRelatedItems,
                            price: newTotalPrice
                          };

                          console.log("Mise à jour du panier:", {
                            item,
                            finalRelatedItems,
                            newTotalPrice,
                            option
                          });

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
              router.push("/horaires");
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
