"use client";

import { useEffect, useState } from "react";
import { StockAlert } from "../types/allTypes";
import { checkStockAlerts } from "../(categories)/stocks/stockService";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [previousAlerts, setPreviousAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des alertes");
        }
        const { products } = await response.json();
        if (!Array.isArray(products)) {
          throw new Error("Format de données invalide");
        }

        const stockAlerts = checkStockAlerts(products);

        // Vérifier s'il y a de nouvelles alertes ou des changements dans les alertes existantes
        const hasNewAlerts = stockAlerts.some(newAlert =>
          !previousAlerts.some(prevAlert =>
            prevAlert.productName === newAlert.productName &&
            prevAlert.currentStock === newAlert.currentStock
          )
        );

        if (hasNewAlerts) {
          setIsExpanded(true);
        }

        setPreviousAlerts(stockAlerts);
        setAlerts(stockAlerts);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des alertes:", error);
        setError(error instanceof Error ? error.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [previousAlerts]);

  if (error) {
    return (
      <div className="absolute top-[120px] right-[200px] z-50">
        <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-2 shadow-lg">
          <p className="text-yellow-700 text-sm">Erreur de chargement des alertes: {error}</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-[120px] right-[200px] z-50">
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-2 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-red-700">Alertes de Stock</h3>
            <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
              {alerts.filter((alert, index, self) =>
                index === self.findIndex(a => a.productName === alert.productName)
              ).length}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-700 hover:text-red-900 text-sm"
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
        {isExpanded && (
          <div className="max-h-40 overflow-y-auto mt-2">
            {alerts
              .filter((alert, index, self) =>
                index === self.findIndex(a => a.productName === alert.productName)
              )
              .map((alert) => (
                <div key={alert.productId} className="mb-1 p-1 bg-white text-black rounded text-sm">
                  <p className="font-semibold">{alert.productName}</p>
                  <p className="text-xs">
                    Stock actuel: {alert.currentStock} / Limite: {alert.stockLimit}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlerts;
