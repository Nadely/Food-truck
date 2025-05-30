"use client";

import { useState, useEffect } from "react";
import { Product } from "../../types/allTypes";
import { saveCurrentStocks, saveLosses } from "./stockService";

const Stocks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Récupération des données impossible");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = products.reduce((acc, item) => {
        acc[item.id] = item.stock;
        return acc;
      }, {} as { [key: number]: number });
      setQuantities(initialQuantities);
    }
  }, [products]);

  if (loading) return <div>Chargement en cours ...</div>;
  if (error) return <div>Une erreur est survenue : {error}</div>;

  // Obtenir toutes les catégories uniques
  const categories = [
    "all",
    ...new Set(products.map((item) => item.categories).flat()),
  ];

  // Filtrer les items selon la catégorie sélectionnée
  const filteredItems =
    selectedCategory === "all"
      ? products
      : products.filter((item) => item.categories.includes(selectedCategory));

  // changer la quantité de stock pour le produit sélectionné
  const handleQuantityChange = (id: number, newValue: number) => {
    setQuantities((prevQuantities: { [key: number]: number }) => ({
      ...prevQuantities,
      [id]: newValue >= 0 ? newValue : prevQuantities[id],
    }));
  };

  // réinitialiser la quantité de stock pour le produit sélectionné
  const handleValidateAllStocks = async () => {
    const updatedProducts = products.map((product) => ({
      ...product,
      stock: quantities[product.id],
      stockAnnuel: product.stockAnnuel + quantities[product.id],
    }));

    const stocksSaved = await saveCurrentStocks(updatedProducts);

    if (stocksSaved) {
      setProducts(updatedProducts);
    } else {
      console.error("Erreur lors de la sauvegarde des stocks");
    }
  };

  const handleLoss = async (id: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          lost: product.lost + quantities[product.id],
          stock: 0,
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setQuantities((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  const handleSaveLosses = async () => {
    const success = await saveLosses(products);

    if (success) {
      const updatedProducts = products.map((product) => ({
        ...product,
        lost: 0,
      }));
      setProducts(updatedProducts);
    } else {
      console.error("Erreur lors de la sauvegarde des pertes");
    }
  };

  return (
    <div className="flex flex-col text-white text-lg mb-5 mt-2">
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
      <table className="border-separate border-spacing-2 border border-slate-500 rounded-lg">
        <thead>
          <tr>
            <th className="border border-slate-600 text-black text-center px-2 rounded-tl-lg bg-slate-200 ">
              Produits
            </th>
            <th className="border border-slate-600 px-2 bg-slate-200">
              {/* Menu déroulant des catégories */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-black"
              >
                {categories.map((categories, index) => (
                  <option key={index} value={categories}>
                    {categories === "all"
                      ? "Toutes les categories"
                      : categories}
                  </option>
                ))}
              </select>
            </th>
            <th className="text-black border border-slate-600 px-2 bg-slate-200">
              Quantite en stock
            </th>
            <th className=" text-black border border-slate-600 px-2 bg-slate-200">
              Quantite conseillee
            </th>
            <th className="text-black border border-slate-600 px-2 bg-slate-200">
              Pertes
            </th>
            <th className="text-black border border-slate-600 px-2 rounded-tr-lg bg-slate-200">
              Stock annuel
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-slate-700 px-2">{item.name}</td>
              <td className="border border-slate-700 px-2">
                {item.categories[0]}
              </td>
              <td className="border border-slate-700 flex justify-between items-center gap-2 ">
                <input
                  type="number"
                  value={quantities[item.id] || 0}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="w-16 text-center text-black px-2 h-[36px]"
                  min="0"
                />
              </td>
              <td className="border border-slate-700 px-2">
                {item.stockConseil}
              </td>
              <td className="border border-slate-700 px-2">
                {item.lost}
                <button
                  onClick={() => handleLoss(item.id)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </td>
              <td className="border border-slate-700 px-2">
                {item.stockAnnuel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stocks;
