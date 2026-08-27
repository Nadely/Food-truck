const fs = require("fs");
const path = require("path");

// Charger les données JSON (nouvelle structure DB)
const produits = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/db/produits.json"), "utf-8")
);
const stocks = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/db/stocks.json"), "utf-8")
);
const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8")
);

// Créer un map des produits par nom pour un accès rapide
const productsMap = new Map();
products.products.forEach((product) => {
  productsMap.set(product.name.toLowerCase(), product);
});

// Parcourir les stocks et mettre à jour avec les données de products.json
for (const stock of stocks) {
  const produit = produits.find((p) => p.id === stock.produit_id);
  if (!produit) continue;

  const matchingProduct = productsMap.get(produit.name.toLowerCase());
  if (matchingProduct) {
    stock.quantite = matchingProduct.stock;
    stock.stockConseil = matchingProduct.stockConseil;
    stock.lost = matchingProduct.lost;
    stock.stockAnnuel = matchingProduct.stockAnnuel;
    stock.stockLimite = matchingProduct.stockLimite;
  } else {
    stock.quantite = 20;
    stock.stockConseil = 0;
    stock.lost = 0;
    stock.stockAnnuel = 20;
    stock.stockLimite = 0;
  }
}

// Sauvegarder stocks.json
fs.writeFileSync(
  path.join(__dirname, "../data/db/stocks.json"),
  JSON.stringify(stocks, null, 2)
);

console.log("Fusion des données de stock terminée !");
