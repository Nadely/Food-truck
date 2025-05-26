import { LossRecord, Product, StockAlert } from "../../types/allTypes";

export const saveLosses = async (lists: Product[]): Promise<boolean> => {
  const currentLosses = lists
    .filter((item) => item.lost > 0)
    .map((item) => ({
      categories: item.categories,
      produit: item.name,
      quantite: item.lost,
    }));

  if (currentLosses.length === 0) {
    return false;
  }

  const newLossRecord: LossRecord = {
    date: new Date().toISOString(),
    items: currentLosses,
  };

  try {
    const response = await fetch("/api/losses-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLossRecord),
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur:", error);
    return false;
  }
};

export const saveCurrentStocks = async (items: Product[]): Promise<boolean> => {
  try {
    const response = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ products: items }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des stocks:", error);
    return false;
  }
};

// export const saveHistoryStocks = async (
//   items: Product[]
// ): Promise<boolean> => {
//   try {
//     const stockData = {
//       date: new Date().toISOString(),
//       stocks: items
//     };

//     const response = await fetch("/api/stocks-history", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({stockData}),
//     });
//     return response.ok;
//   } catch (error) {
//     console.error("Erreur lors de la sauvegarde des stocks:", error);
//     return false;
//   }
// };

export const checkStockAlerts = (products: Product[]): StockAlert[] => {
  if (!products || !Array.isArray(products)) {
    console.warn("Aucun produit disponible pour vérifier les alertes de stock");
    return [];
  }

  const DEFAULT_STOCK_LIMIT = 15; // Valeur par défaut pour stockLimite

  return products
    .filter(product => product && product.stock <= (product.stockLimite || DEFAULT_STOCK_LIMIT))
    .map(product => ({
      productId: product.id,
      productName: product.name,
      currentStock: product.stock,
      stockLimit: product.stockLimite || DEFAULT_STOCK_LIMIT,
      categories: product.categories,
      isAlert: true
    }));
};

export const updateStockFromOrder = async (orderItems: any[]): Promise<boolean> => {
  try {
    console.log("📦 Mise à jour des stocks pour la commande:", orderItems);

    // Récupérer les produits actuels
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des produits");
    }
    const { products } = await response.json();
    console.log("📦 Produits actuels:", products);

    // Créer une map des produits par nom pour une recherche plus rapide
    const productsByName = new Map(
      products.map((p: Product) => [p.name.toLowerCase().trim(), p])
    );

    // Préparer les mises à jour par catégorie
    const updatesByCategory = new Map();

    // Mettre à jour les stocks pour chaque item de la commande
    orderItems.forEach(item => {
      const itemName = item.name?.toLowerCase().trim();
      const itemQuantity = item.quantity || 1;

      // Vérifier l'item principal
      const mainProduct = productsByName.get(itemName);
      if (mainProduct) {
        const category = mainProduct.categories[0];
        if (!updatesByCategory.has(category)) {
          updatesByCategory.set(category, new Map());
        }
        updatesByCategory.get(category).set(mainProduct.name, {
          ...mainProduct,
          stock: Math.max(0, mainProduct.stock - itemQuantity)
        });
        console.log(`📉 Mise à jour du stock pour ${mainProduct.name}:`, {
          ancienStock: mainProduct.stock,
          nouvelleQuantite: itemQuantity,
          nouveauStock: Math.max(0, mainProduct.stock - itemQuantity)
        });
      }

      // Vérifier les items liés
      item.relatedItems?.forEach(related => {
        const relatedName = related.name?.toLowerCase().trim();
        const relatedProduct = productsByName.get(relatedName);
        if (relatedProduct) {
          const category = relatedProduct.categories[0];
          if (!updatesByCategory.has(category)) {
            updatesByCategory.set(category, new Map());
          }
          updatesByCategory.get(category).set(relatedProduct.name, {
            ...relatedProduct,
            stock: Math.max(0, relatedProduct.stock - itemQuantity)
          });
          console.log(`📉 Mise à jour du stock pour ${relatedProduct.name}:`, {
            ancienStock: relatedProduct.stock,
            nouvelleQuantite: itemQuantity,
            nouveauStock: Math.max(0, relatedProduct.stock - itemQuantity)
          });
        }
      });
    });

    // Envoyer la mise à jour au serveur
    const updateResponse = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: Array.from(updatesByCategory.values())
          .flatMap(categoryMap => Array.from(categoryMap.values()))
      }),
    });

    if (!updateResponse.ok) {
      throw new Error("Erreur lors de la mise à jour des stocks");
    }

    console.log("✅ Mise à jour des stocks terminée avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des stocks:", error);
    return false;
  }
};
