const fs = require('fs');

// Charger les données JSON
const dataProduits = JSON.parse(fs.readFileSync("src/data/dataProduits.json", "utf-8"));
const products = JSON.parse(fs.readFileSync("src/data/products.json", "utf-8"));

// Créer un map des produits par nom pour un accès rapide
const productsMap = new Map();
products.products.forEach(product => {
  productsMap.set(product.name.toLowerCase(), product);
});

// Fonction pour trouver le produit correspondant
function findMatchingProduct(productName) {
  return productsMap.get(productName.toLowerCase());
}

// Parcourir toutes les catégories et produits
for (const [categorie, produits] of Object.entries(dataProduits)) {
  for (const produit of produits) {
    const matchingProduct = findMatchingProduct(produit.name);
    if (matchingProduct) {
      // Ajouter les informations de stock
      produit.stock = matchingProduct.stock;
      produit.stockConseil = matchingProduct.stockConseil;
      produit.lost = matchingProduct.lost;
      produit.stockAnnuel = matchingProduct.stockAnnuel;
      produit.stockLimite = matchingProduct.stockLimite;
      produit.categories = matchingProduct.categories;
    } else {
      // Valeurs par défaut si le produit n'est pas trouvé
      produit.stock = 20;
      produit.stockConseil = 0;
      produit.lost = 0;
      produit.stockAnnuel = 20;
      produit.stockLimite = 0;
      produit.categories = [categorie.toLowerCase()];
    }
  }
}

// Sauvegarder le fichier fusionné
fs.writeFileSync("src/data/dataProduits.json", JSON.stringify(dataProduits, null, 2));

console.log("Fusion des données de stock terminée !");
