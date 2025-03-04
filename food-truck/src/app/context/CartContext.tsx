import React, { createContext, useContext, useEffect, useState } from "react";

// Type pour les éléments du panier
type CartItem = {
  uniqueId: string; // ID unique pour chaque instance ajoutée au panier
  id: number; // ID du produit de base
  name: string;
  image: string;
  price: number;
  quantity: number;
  categorie?: string[]; // Indique la catégorie du produit
  isMenu?: boolean; // Indique si l'option menu est sélectionnée
  viaMitraillette?: boolean; // Indique si c'est "viaMitraillette"
  relatedItems?: CartItem[]; // Liste des produits associés
  isSnack?: boolean; // Indique si c'est un snack lié
  isGarniture?: boolean; // Indique si c'est une garniture*
  isRelateItem?: boolean;
  isSauce?: boolean; // Indique si c'est un sauce
  viaVeggiMitraillette?: boolean; // Indique si c'est "viaVeggiMitraillette"
  viaSnacksVeggies?: boolean; // Indique si c'est "viaSnacksVeggies"
  viaBurgers?: boolean; // Indique si c'est "viaBurgers"
  menuOption?: boolean; // Indique si c'est lié à un menu
  supplementPrice?: number; // Montant du supplément (1€ si menu)
  viaSupplements?: boolean; // Indique si c'est lié à un supplément
};

// Type pour le contexte du panier
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "uniqueId">) => void; // uniqueId est généré automatiquement
  removeFromCart: (uniqueId: string) => void;
  remove: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, quantity: number) => void;
  clearCart: () => void;
  getCart: () => CartItem[];
  setCart: (cart: CartItem[]) => void;
  setViaMitraillette: (viaMitraillette: boolean) => void;
  setRelatedItems: (relatedItems: CartItem[]) => void;
  getViaMitraillette: () => boolean;
  getRelatedItems: () => CartItem[];
  updateRelatedItems: (relatedItems: CartItem[]) => void;
  clearRelatedItems: () => void;
  addRelatedItem: (item: Omit<CartItem, "uniqueId">) => void;
  removeRelatedItem: (uniqueId: string) => void;
  updateRelatedItem: (uniqueId: string, quantity: number) => void;
  clearRelatedItem: (uniqueId: string) => void;
  getRelatedItem: (uniqueId: string) => CartItem | undefined;
  deleteRelatedItem: (uniqueId: string) => void;
  deleteRelatedItems: (uniqueId: string[]) => void;
  getRelatedItemsVia: (viaMitraillette: boolean) => CartItem[];
  updateRelatedItemsVia: (
    viaMitraillette: boolean,
    relatedItems: CartItem[]
  ) => void;
  clearRelatedItemsVia: (viaMitraillette: boolean) => void;
  addRelatedItemVia: (
    viaMitraillette: boolean,
    item: Omit<CartItem, "uniqueId">
  ) => void;
  removeRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  updateRelatedItemVia: (
    viaMitraillette: boolean,
    uniqueId: string,
    quantity: number
  ) => void;
  clearRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  getRelatedItemVia: (
    viaMitraillette: boolean,
    uniqueId: string
  ) => CartItem | undefined;
  deleteRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  deleteRelatedItemsVia: (viaMitraillette: boolean, uniqueId: string[]) => void;
};

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Générateur d'ID unique
const generateUniqueId = () =>
  `cart-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

// Provider pour le contexte du panier
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    console.log("Cart updated:", cart);
  }, [cart]);


  // Ajouter un produit au panier
  const addToCart = (item: Omit<CartItem, "uniqueId">) => {
    console.log("Avant ajout au panier:", item); // Log des données juste avant l'ajout

    const uniqueId = generateUniqueId();
    const relatedItemsWithIds = item.relatedItems?.map((related) => ({
      ...related,
      uniqueId: generateUniqueId(),
      parentId: uniqueId, // Lier les éléments au produit principal
    }));

    const newItem = { ...item, uniqueId, relatedItems: relatedItemsWithIds || [] };
    setCart((prevCart) => [...prevCart, newItem]);

    console.log("Après ajout au panier:", newItem); // Vérifiez si le prix est modifié ici
  };

  // Retirer un produit et ses éléments liés
  const removeFromCart = () => {
    setCart((prevCart) =>
      prevCart.filter((item) => !item.relatedItems || item.relatedItems.length === 0)
    );
  };

  const remove = (uniqueId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => {
        // On supprime l'élément principal et les éléments liés
        if (item.uniqueId === uniqueId) return false;
        if (item.relatedItems?.some((related) => related.uniqueId === uniqueId))
          return false;
        return true;
      })
    );
  };

  const getRelatedItemsVia = (parentId: string, viaMitraillette?: boolean) => {
    return (
      cart
        .find((item) => item.uniqueId === parentId)
        ?.relatedItems?.filter((related) =>
          viaMitraillette !== undefined ? related.viaMitraillette === viaMitraillette : true
        ) || []
    );
  };


  const removeRelatedItemVia = (parentId: string, relatedUniqueId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.uniqueId === parentId) {
          return {
            ...item,
            relatedItems: item.relatedItems?.filter(
              (related) => related.uniqueId !== relatedUniqueId
            ),
          };
        }
        return item;
      })
    );
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (uniqueId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.uniqueId === uniqueId) {
          return { ...item, quantity };
        }

        if (item.relatedItems) {
          return {
            ...item,
            relatedItems: item.relatedItems.map((related) =>
              related.uniqueId === uniqueId ? { ...related, quantity } : related
            ),
          };
        }

        return item;
      })
    );
  };

  // Exemple de fonction pour enregistrer le panier
  const saveCartToFile = async () => {
    try {
      const response = await fetch("/api/panier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart), // Assurez-vous que le panier est correctement formaté ici
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Erreur lors de l'enregistrement du panier:", errorMessage);
      }
    } catch (error) {
      console.error("Erreur réseau lors de l'enregistrement du panier:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        remove,
        updateQuantity,
        setCart,
        setViaMitraillette: () => {}, // Ajoutez un comportement ou laissez-le vide si non nécessaire
        setRelatedItems: () => {}, // Idem ici
        getViaMitraillette: () => false, // Ou un comportement par défaut
        getRelatedItems: () => [],
        updateRelatedItems: () => {},
        clearRelatedItems: () => {},
        addRelatedItem: () => {},
        removeRelatedItem: () => {},
        updateRelatedItem: () => {},
        clearRelatedItem: () => {},
        getRelatedItem: () => undefined,
        deleteRelatedItem: () => {},
        deleteRelatedItems: () => {},
        getRelatedItemsVia: () => [],
        updateRelatedItemsVia: () => {},
        clearRelatedItemsVia: () => {},
        addRelatedItemVia: () => {},
        removeRelatedItemVia: () => {},
        updateRelatedItemVia: () => {},
        clearRelatedItemVia: () => {},
        getRelatedItemVia: () => undefined,
        deleteRelatedItemVia: () => {},
        deleteRelatedItemsVia: () => {},
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook pour utiliser le contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
