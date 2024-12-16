"use client";

import { useState } from "react";
import listProduits from "./listProduits.json";
import { StockItem } from "./api/types/stock";
import { saveCurrentStocks, saveLosses } from "./stockService";

interface Quantities {
  [key: number]: number;
}

//mettre la liste des produits dans un tableau
const lists: StockItem[] = listProduits.lists;

const Stocks = () => {
  // État pour stocker la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("all");

  // const [lossHistory, setLossHistory] = useState<LossRecord[]>([]);

  const [quantities, setQuantities] = useState<Quantities>(
    lists.reduce((acc: Quantities, item) => {
      acc[item.id] = item.stock;
      return acc;
    }, {})
  );
  // Obtenir toutes les catégories uniques
  const categories = ["all", ...new Set(lists.map((item) => item.categorie))];

  // Filtrer les items selon la catégorie sélectionnée
  const filteredItems =
    selectedCategory === "all"
      ? lists
      : lists.filter((item) => item.categorie === selectedCategory);

  // changer la quantité de stock pour le produit sélectionné
  const handleQuantityChange = (id: number, newValue: number) => {
    setQuantities((prevQuantities: Quantities) => ({
      ...prevQuantities,
      [id]: newValue >= 0 ? newValue : prevQuantities[id],
    }));
  };

  // réinitialiser la quantité de stock pour le produit sélectionné
  const handleLoss = (id: number) => {
    setQuantities((prevQuantities: Quantities) => ({
      ...prevQuantities,
      [id]: 0,
    }));

    // Mettre à jour les pertes dans la liste
    const item = lists.find((item) => item.id === id);
    if (item) {
      item.perdue += quantities[item.id];
    }
  };

  // valider tous les stocks
  const handleValidateAllStocks = async () => {
    filteredItems.forEach((item) => {
      const currentStock = quantities[item.id];
      item.stockAnnuel += currentStock;
      item.stock = currentStock;
    });

    const stocksSaved = await saveCurrentStocks(lists);

    if (stocksSaved) {
      // Concerve les quantités actuelles
      setQuantities((prevQuantities) => {
        const newQuantities = { ...prevQuantities };
        Object.keys(newQuantities).forEach((key) => {
          newQuantities[Number(key)] = quantities[Number(key)];
        });
        return newQuantities;
      });
    } else {
      console.error("Erreur lors de la sauvegarde des stocks");
    }
  };

  const handleSaveLosses = async () => {
    const success = await saveLosses(lists);

    if (success) {
      // Réinitialiser toutes les pertes à 0
      lists.forEach((item) => {
        item.perdue = 0;
      });
      // Forcer le re-rendu
      setQuantities({ ...quantities });
    } else {
      console.error("Erreur lors de la sauvegarde des pertes");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full flex justify-end mb-4">
        <button
          onClick={handleSaveLosses}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-4"
        >
          Enregistrer les pertes
        </button>
        <button
          onClick={handleValidateAllStocks}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-10"
        >
          Valider tout le stock
        </button>
      </div>
      <table className="border-separate border-spacing-2 border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600">Produits</th>
            <th className="border border-slate-600">
              {/* Menu déroulant des catégories */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === "all" ? "Toutes les catégories" : category}
                  </option>
                ))}
              </select>
            </th>
            <th className="border border-slate-600">Quantité en stock</th>
            <th className="border border-slate-600">Quantité conseillée</th>
            <th className="border border-slate-600">Pertes</th>
            <th className="border border-slate-600">Stock annuel</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td className="border border-slate-700">{item.produit}</td>
              <td className="border border-slate-700">{item.categorie}</td>
              <td className="border border-slate-700 flex justify-between items-center gap-2">
                <input
                  type="number"
                  value={quantities[item.id]}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="w-16 text-center text-black"
                  min="0"
                />
              </td>
              <td className="border border-slate-700">{item.conseille}</td>
              <td className="border border-slate-700">
                {item.perdue}
                <button
                  onClick={() => handleLoss(item.id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </td>
              <td className="border border-slate-700">{item.stockAnnuel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stocks;
