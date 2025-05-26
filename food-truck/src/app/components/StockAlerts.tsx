"use client";

import { useEffect, useState } from "react";
import { StockAlert } from "../types/allTypes";
import { checkStockAlerts } from "../(categories)/stocks/stockService";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [previousAlertsCount, setPreviousAlertsCount] = useState(0);

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
        setAlerts(stockAlerts);

        // Réouvrir la fenêtre si de nouvelles alertes sont détectées
        if (stockAlerts.length > previousAlertsCount) {
          setIsExpanded(true);
        }
        setPreviousAlertsCount(stockAlerts.length);

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
  }, [previousAlertsCount]);

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4 shadow-lg">
          <p className="text-yellow-700">Erreur de chargement des alertes: {error}</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-red-700">Alertes de Stock</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-700 hover:text-red-900"
          >
            {isExpanded ? "▼" : "▲"}
          </button>
        </div>
        {isExpanded && (
          <div className="max-h-60 overflow-y-auto">
            {alerts
              .filter((alert, index, self) =>
                index === self.findIndex(a => a.productName === alert.productName)
              )
              .map((alert) => (
                <div key={alert.productId} className="mb-2 p-2 bg-white rounded">
                  <p className="font-semibold">{alert.productName}</p>
                  <p className="text-sm">
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
