import React, { createContext, useContext, useState } from "react";

// Type pour les éléments du panier
type CartItem = {
  uniqueId: string; // ID unique pour chaque instance ajoutée au panier
  id: number; // ID du produit de base
  name: string;
  price: number;
  quantity: number;
  categories: string[];
  isMenu?: boolean; // Indique si l'option menu est sélectionnée
  viaMitraillette?: boolean; // Indique si c'est "viaMitraillette"
  relatedItems?: CartItem[]; // Liste des produits associés
  isSnack?: boolean; // Indique si c'est un snack lié
  isGarniture?: boolean; // Indique si c'est une garniture
  viaVeggiMitraillette?: boolean; // Indique si c'est "viaVeggiMitraillette"
  viaSnacksVeggies?: boolean; // Indique si c'est "viaSnacksVeggies"
  viaBurgers?: boolean; // Indique si c'est "viaBurgers"
  categorie?: string; // Indique la catégorie du produit
  menuOption?: boolean; // Indique si c'est lié à un menu
  supplementPrice?: number; // Montant du supplément (1€ si menu)
  viaSupplements?: boolean; // Indique si c'est lié à un supplément
};

// Type pour le contexte du panier
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "uniqueId">) => void; // uniqueId est généré automatiquement
  removeFromCart: (uniqueId: string) => void;
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
  updateRelatedItemsVia: (viaMitraillette: boolean, relatedItems: CartItem[]) => void;
  clearRelatedItemsVia: (viaMitraillette: boolean) => void;
  addRelatedItemVia: (viaMitraillette: boolean, item: Omit<CartItem, "uniqueId">) => void;
  removeRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  updateRelatedItemVia: (viaMitraillette: boolean, uniqueId: string, quantity: number) => void;
  clearRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  getRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => CartItem | undefined;
  deleteRelatedItemVia: (viaMitraillette: boolean, uniqueId: string) => void;
  deleteRelatedItemsVia: (viaMitraillette: boolean, uniqueId: string[]) => void;
};

// Création du contexte
const CartContext = createContext<CartContextType | undefined>(undefined);

// Générateur d'ID unique
const generateUniqueId = () => `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Provider pour le contexte du panier
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Ajouter un produit au panier
  const addToCart = (item: Omit<CartItem, "uniqueId">) => {
    const uniqueId = generateUniqueId(); // ID unique pour l'élément principal
    const relatedItemsWithIds = item.relatedItems?.map((related) => ({
      ...related,
      uniqueId: generateUniqueId(), // Génération d'ID pour chaque élément lié
    }));

    setCart((prevCart) => [
      ...prevCart,
      { ...item, uniqueId, relatedItems: relatedItemsWithIds || [] },
    ]);

    console.log("Données reçues dans la requête :", cart);
  };


  // Retirer un produit et ses éléments liés
  const removeFromCart = (uniqueId: string) => {
  setCart((prevCart) =>
    prevCart.filter((item) => {
      // On supprime l'élément principal et les éléments liés
      if (item.uniqueId === uniqueId) return false;
      if (item.relatedItems?.some((related) => related.uniqueId === uniqueId)) return false;
      return true;
    })
  );
};


  const getRelatedItemsVia = (parentId: string) => {
    return cart.find((item) => item.uniqueId === parentId)?.relatedItems || [];
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
        // Mise à jour de l'élément principal
        if (item.uniqueId === uniqueId) {
          return { ...item, quantity };
        }

        // Mise à jour des éléments liés
        if (item.relatedItems?.some((related) => related.uniqueId === uniqueId)) {
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


  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      setCart,
      setViaMitraillette: () => {}, // Ajoutez un comportement ou laissez-le vide si non nécessaire
      setRelatedItems: () => {},    // Idem ici
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
    }}>
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
