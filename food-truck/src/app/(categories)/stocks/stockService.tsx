import { LossRecord, Product } from "@/app/types/record";

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

export const saveHistoryStocks = async (
  items: Product[]
): Promise<boolean> => {
  try {
    const stockData = {
      date: new Date().toISOString(),
      stocks: items
    };
    
    const response = await fetch("/api/stocks-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({stockData}),
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des stocks:", error);
    return false;
  }
};
