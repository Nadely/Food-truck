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

  const generateUniqueId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

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
          // Pour les suppléments, on utilise leur prix réel
          if (related.isSupplements) {
            return sum + cleanPrice(related.price || 0);
          }
          // Pour les sauces, on ne compte pas le prix si le produit principal est à 0
          if (related.categorie?.toLowerCase() === "sauces" && itemPrice === 0) {
            return sum;
          }
          // Pour les sauces avec un produit principal qui a un prix
          if (related.categorie?.toLowerCase() === "sauces") {
            return sum + (related.name === "Aucune sauce" ? 0 : 0.5);
          }
          // Pour les snacks, on ne compte pas le prix
          if (related.categorie?.toLowerCase().includes('snacks')) {
            return sum;
          }
          // Pour les autres items, utiliser leur prix
          return sum + cleanPrice(related.price || 0);
        }, 0)
      : 0;

    // Si c'est un menu avec suppléments, on ne compte que les suppléments
    if (item.relatedItems?.some(related => related.isSupplements)) {
      return acc + relatedItemsTotal * quantity;
    }

    return acc + (itemPrice + relatedItemsTotal) * quantity;
  }, 0);

  const handleTransferCommandes = async () => {
    try {
      const cleanedPrice = cleanPrice(total.toFixed(2) + "€");

      // Préparer les items avec leurs groupId
      const itemsWithGroupId = cart.map(item => {
        const groupId = item.groupId || generateUniqueId('group');
        return {
          ...item,
          groupId,
          uniqueId: generateUniqueId('item'),
          relatedItems: item.relatedItems?.map(related => ({
            ...related,
            groupId,
            uniqueId: generateUniqueId('related')
          }))
        };
      });

      console.log("Items avec groupId:", itemsWithGroupId);

      // Mettre à jour les stocks dans dataProduits.json
      const productsResponse = await fetch("/api/products");
      if (!productsResponse.ok) {
        throw new Error("Erreur lors de la récupération des produits");
      }
      const { products } = await productsResponse.json();

      // Créer une map des produits par nom pour une recherche plus rapide
      const productsByName = new Map(
        products.map((p: any) => [p.name.toLowerCase().trim(), p])
      );

      // Préparer les mises à jour de stock
      const updatedProducts = products.map((product: any) => {
        const productName = product.name.toLowerCase().trim();
        let quantityToSubtract = 0;

        // Gestion des exceptions pour les pains mitraillette et burger
        if (productName === 'pain mitraillette') {
          // Chercher toutes les mitraillettes dans la commande
          const mitrailletteItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('mitraillette');
          });
          console.log('🍞 Items mitraillette trouvés:', mitrailletteItems);
          quantityToSubtract = mitrailletteItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🍞 Mise à jour stock pain mitraillette: -${quantityToSubtract}`);
        }
        else if (productName === 'pain burger') {
          // Chercher tous les burgers dans la commande
          const burgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('burger');
          });
          console.log('🍞 Items burger trouvés:', burgerItems);
          quantityToSubtract = burgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🍞 Mise à jour stock pain burger: -${quantityToSubtract}`);
        }
        else if (productName === 'fish') {
          // Chercher tous les fish burgers dans la commande
          const fishBurgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('fish burger');
          });
          console.log('🐟 Items fish burger trouvés:', fishBurgerItems);
          quantityToSubtract = fishBurgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🐟 Mise à jour stock fish: -${quantityToSubtract}`);
        }
        else if (productName === 'chicken') {
          // Chercher tous les chicken burgers dans la commande
          const chickenBurgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('chicken burger');
          });
          console.log('🍗 Items chicken burger trouvés:', chickenBurgerItems);
          quantityToSubtract = chickenBurgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🍗 Mise à jour stock chicken: -${quantityToSubtract}`);
        }
        else if (productName === 'steak crispy') {
          // Chercher tous les crispy burgers dans la commande
          const crispyBurgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('crispy burger');
          });
          console.log('🍖 Items crispy burger trouvés:', crispyBurgerItems);
          quantityToSubtract = crispyBurgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🍖 Mise à jour stock steak crispy: -${quantityToSubtract}`);
        }
        else if (productName === 'steak mexicain') {
          // Chercher tous les mexicain burgers dans la commande
          const mexicainBurgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('mexicano burger');
          });
          console.log('🌮 Items mexicain burger trouvés:', mexicainBurgerItems);
          quantityToSubtract = mexicainBurgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🌮 Mise à jour stock steak mexicain: -${quantityToSubtract}`);
        }
        else if (productName === 'steack') {
          // Chercher tous les burgers classiques et bicky dans la commande
          const classicBurgerItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();
            return itemName?.includes('burger') &&
                   !itemName?.includes('fish') &&
                   !itemName?.includes('chicken') &&
                   !itemName?.includes('crispy') &&
                   !itemName?.includes('mexicano');
          });
          console.log('🥩 Items burger classique trouvés:', classicBurgerItems);
          quantityToSubtract = classicBurgerItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
          console.log(`🥩 Mise à jour stock steak haché: -${quantityToSubtract}`);
        }
        else {
          // Logique normale pour les autres produits
          const matchingItems = itemsWithGroupId.filter(item => {
            const itemName = item.name?.toLowerCase().trim();

            // Vérifier l'item principal
            if (itemName === productName) {
              console.log(`✅ Match trouvé pour ${product.name} (item principal)`);
              return true;
            }

            // Vérifier les items liés
            return item.relatedItems?.some(related => {
              const relatedName = related.name?.toLowerCase().trim();
              const isMatch = relatedName === productName;
              if (isMatch) {
                console.log(`✅ Match trouvé pour ${product.name} (item lié)`);
              }
              return isMatch;
            });
          });

          quantityToSubtract = matchingItems.reduce((total, item) =>
            total + (item.quantity || 1), 0
          );
        }

        if (quantityToSubtract > 0) {
          const newStock = Math.max(0, product.stock - quantityToSubtract);
          console.log(`📉 Mise à jour du stock de ${product.name}:`, {
            ancienStock: product.stock,
            nouvelleQuantite: quantityToSubtract,
            nouveauStock: newStock
          });

          return {
            ...product,
            stock: newStock
          };
        }

        return product;
      });

      // Envoyer la mise à jour des stocks
      const updateStockResponse = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: updatedProducts }),
      });

      if (!updateStockResponse.ok) {
        throw new Error("Erreur lors de la mise à jour des stocks");
      }

      // Envoyer la commande
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

      const orderResponse = await fetch("/api/panier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (orderResponse.ok) {
        setCart([]);
        setRefreshKey((prev) => prev + 1);
      } else {
        const data = await orderResponse.json();
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
    const isSupplement = relatedProduct.isSupplements;

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
    } else if (isSupplement) {
      // Pour les suppléments, on montre tous les produits de la catégorie Supplements
      options = allProducts
        .filter(
          (product) =>
            typeof product.categorie === "string" &&
            product.categorie.toLowerCase() === "supplements"
        )
        .map(({ id, name, image, price, uniqueId }) => ({
          id,
          name,
          image,
          price: cleanPrice(price),
          uniqueId,
          isSupplements: true
        }));
    } else {
      // En dehors du menu enfants, on cherche d'abord dans les catégories Snacks et Boissons
      const fullProductData = allProducts.find(
        (prod) =>
          prod.name.trim().toLowerCase() === baseName.trim().toLowerCase() &&
          (prod.categorie === "Snacks" || prod.categorie === "Boissons" || prod.categorie === "Sauces")
      );

      if (fullProductData?.categorie) {
        const normalizedCategory = fullProductData.categorie.toLowerCase();
        options = allProducts
          .filter(
            (product) =>
              typeof product.categorie === "string" &&
              product.categorie.toLowerCase() === normalizedCategory
          )
          .map(({ id, name, image, price, uniqueId, categorie }) => ({
            id,
            name,
            image,
            price: categorie?.toLowerCase() === "sauces" ? (name === "Aucune sauce" ? 0 : 0.5) : cleanPrice(price),
            uniqueId,
            categorie
          }));
      }
    }

    // Éviter les doublons en utilisant un Set pour les noms uniques
    const uniqueNames = new Set();
    options = options.filter(option => {
      const isDuplicate = uniqueNames.has(option.name);
      uniqueNames.add(option.name);
      return !isDuplicate;
    });

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
    <div key={refreshKey} className="flex flex-col text-black h-screen">
      <div className="flex-grow">
        <h2 className="text-xl text-center style-pen border-b-2 border-black mb-4">Panier</h2>
        {cart.length === 0 ? (
          <div className="text-center text-black">Votre panier est vide.</div>
        ) : (
          <ul className="list-none p-0">
            {cart.filter(item => {
              // Ne jamais afficher les sauces comme produits principaux
              return !item.categorie?.toLowerCase().includes("sauces");
            }).map((item: any) => {
              return (
                <li key={item.uniqueId} className="mb-4">
                  <div className="flex justify-between items-center text-black">
                    <div className="flex items-center">
                      {!item.isHidden && !item.isSupplements && !item.relatedItems?.some(rel => rel.categorie?.toLowerCase() === "sauces") && !item.relatedItems?.some(rel => rel.categorie?.toLowerCase() === "snacks") && (
                        <>
                          <Image
                            src={item.name === "Menu Enfants" ? "/Enfants.png" : item.image}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-contain bg-white"
                          />
                          <p className="ml-2 style-pen">
                            {item.categorie === "Enfants" ? "Menu Enfants" : item.name}
                          </p>
                        </>
                      )}
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
                      ((!item.relatedItems) || item.relatedItems.length === 0) && (
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
                    {cleanPrice(item.price) > 0 && !item.isSupplements && !item.relatedItems?.some(rel => rel.categorie?.toLowerCase() === "sauces") && (
                      <p>Prix unitaire : {item.price.toFixed(2)}€</p>
                    )}
                    {item.quantity > 1 && !item.isSupplements && <p>Quantite : {item.quantity}</p>}
                    {item.relatedItems?.length > 0 && (
                      <>
                        {item.relatedItems.some(related => related.isSupplements) && (
                          <div className="mb-2">
                          </div>
                        )}
                        <ul className="ml-4 mt-2">
                          {item.relatedItems.map((related, index) => (
                            <li key={generateUniqueId(`related-${related.id}-${index}`)} className="flex items-center mb-1">
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
              );
            })}
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
                              const isSauce = related.categorie?.toLowerCase() === "sauces";
                              return {
                                ...related,
                                ...option,
                                price: isSauce ? (option.name === "Aucune sauce" ? 0 : 0.5) : cleanPrice(option.price || 0),
                                uniqueId: `sauce-${option.id}-${Date.now()}`
                              };
                            }
                            return related;
                          });

                          // Si "Aucune sauce" est sélectionné, s'assurer qu'il n'y a qu'un seul élément
                          const finalRelatedItems = option.name === "Aucune sauce"
                            ? updatedRelatedItems.filter(item => item.name === "Aucune sauce").slice(0, 1)
                            : updatedRelatedItems.filter(item => item.name !== "Aucune sauce").concat(
                                updatedRelatedItems.find(item => item.uniqueId === currentRelatedId) || []
                              );

                          const updatedItem = {
                            ...item,
                            name: item.name,
                            image: item.image,
                            relatedItems: finalRelatedItems,
                            price: item.price
                          };

                          console.log("Mise à jour du panier:", {
                            item,
                            finalRelatedItems,
                            updatedItem,
                            prixOriginal: item.price,
                            prixSauces: finalRelatedItems.map(sauce => ({
                              nom: sauce.name,
                              prix: sauce.price
                            }))
                          });

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
