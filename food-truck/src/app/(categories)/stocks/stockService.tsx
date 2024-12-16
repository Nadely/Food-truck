import { LossRecord, StockItem } from "./api/types/stock";

export const saveLosses = async (lists: StockItem[]): Promise<boolean> => {
  const currentLosses = lists
    .filter((item) => item.perdue > 0)
    .map((item) => ({
      categories: item.categorie,
      produit: item.produit,
      quantite: item.perdue,
    }));

  if (currentLosses.length === 0) {
    return false;
  }

  const newLossRecord: LossRecord = {
    date: new Date().toISOString(),
    items: currentLosses,
  };

  try {
    const response = await fetch("/stocks/api/losses-history", {
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

export const saveCurrentStocks = async (
  items: StockItem[]
): Promise<boolean> => {
  try {
    const response = await fetch("/stocks/api/stocks-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stocks: items }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des stocks:", error);
    return false;
  }
};
