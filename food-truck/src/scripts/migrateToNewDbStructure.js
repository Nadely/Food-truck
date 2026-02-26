/**
 * Script pour migrer dataProduits vers la nouvelle structure DB:
 * CATEGORIES ───< PRODUITS >── PRODUIT_GARNITURES >── GARNITURES
 *                      |
 *                      >── PRODUIT_TAGS >── TAGS
 *                      |
 *                      >── STOCKS >── MOUVEMENTS_STOCK
 * COMMANDES ───< LIGNE_COMMANDES
 * Note: TAGS correspond au champ "categories" de dataProduits
 */

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const dbDir = path.join(dataDir, "db");

// Créer le dossier db
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Lire les données sources
const dataProduits = JSON.parse(
  fs.readFileSync(path.join(dataDir, "dataProduits.json"), "utf-8")
);
const historique = JSON.parse(
  fs.readFileSync(path.join(dataDir, "historique.json"), "utf-8")
);
const stocksHistory = fs.existsSync(path.join(dataDir, "stocks-history.json"))
  ? JSON.parse(fs.readFileSync(path.join(dataDir, "stocks-history.json"), "utf-8"))
  : [];
const lossesHistory = fs.existsSync(path.join(dataDir, "losses-history.json"))
  ? JSON.parse(fs.readFileSync(path.join(dataDir, "losses-history.json"), "utf-8"))
  : [];

// Extraire les catégories (clés de dataProduits)
const categoryNames = Object.keys(dataProduits);
const categories = categoryNames.map((name, index) => ({
  id: index + 1,
  name
}));

// Extraire les tags uniques (champ "categories" des produits = TAGS)
const tagsSet = new Set();
const tagToId = {};
let tagId = 1;
for (const [, products] of Object.entries(dataProduits)) {
  for (const product of products) {
    if (product.categories) {
      for (const tag of product.categories) {
        if (!tagsSet.has(tag)) {
          tagsSet.add(tag);
          tagToId[tag] = tagId++;
        }
      }
    }
  }
}
const tags = Array.from(tagsSet).map(name => ({
  id: tagToId[name],
  name
}));

// Extraire les garnitures uniques
const garnituresMap = new Map();
let garnitureId = 1;
for (const [, products] of Object.entries(dataProduits)) {
  for (const product of products) {
    if (product.garniture && Array.isArray(product.garniture)) {
      for (const g of product.garniture) {
        const key = `${g.name}-${g.image}`;
        if (!garnituresMap.has(key)) {
          garnituresMap.set(key, {
            id: garnitureId++,
            name: g.name,
            image: g.image || ""
          });
        }
      }
    }
  }
}
const garnitures = Array.from(garnituresMap.values());

// Créer les produits avec IDs globaux
const produits = [];
const produitGarnitures = [];
const produitTags = [];
const stocks = [];
let produitId = 1;
const produitNameToId = {};

for (const [catName, products] of Object.entries(dataProduits)) {
  const categorie = categories.find(c => c.name === catName);
  const categorieId = categorie ? categorie.id : null;

  for (const p of products) {
    const globalId = produitId++;
    produitNameToId[`${catName}-${p.name}`] = globalId;

    produits.push({
      id: globalId,
      name: p.name,
      image: p.image || "",
      price: p.price || "",
      categorie_id: categorieId
    });

    // Stock
    stocks.push({
      id: globalId,
      produit_id: globalId,
      quantite: p.stock ?? 20,
      stockConseil: p.stockConseil ?? 0,
      lost: p.lost ?? 0,
      stockAnnuel: p.stockAnnuel ?? 20,
      stockLimite: p.stockLimite ?? 0
    });

    // Garnitures (PRODUIT_GARNITURES)
    if (p.garniture && Array.isArray(p.garniture)) {
      for (const g of p.garniture) {
        const key = `${g.name}-${g.image}`;
        const garniture = garnituresMap.get(key);
        if (garniture) {
          produitGarnitures.push({
            produit_id: globalId,
            garniture_id: garniture.id
          });
        }
      }
    }

    // Tags (PRODUIT_TAGS) - categories = TAGS
    if (p.categories) {
      for (const tagName of p.categories) {
        const tagId = tagToId[tagName];
        if (tagId) {
          produitTags.push({
            produit_id: globalId,
            tag_id: tagId
          });
        }
      }
    }
  }
}

// MOUVEMENTS_STOCK - à partir de stocks-history et losses-history
const mouvementsStock = [];
let mouvementId = 1;

// Depuis stocks-history (changements de stock)
for (const entry of stocksHistory) {
  if (entry.stockData && entry.stockData.stocks) {
    for (const s of entry.stockData.stocks) {
      mouvementsStock.push({
        id: mouvementId++,
        stock_id: s.id,
        type: "ajustement",
        quantite: s.stock,
        date: entry.stockData.date,
        produit_nom: s.name
      });
    }
  }
}

// Depuis losses-history
for (const entry of lossesHistory) {
  for (const item of entry.items || []) {
    mouvementsStock.push({
      id: mouvementId++,
      type: "perte",
      quantite: -item.quantite,
      date: entry.date,
      produit_nom: item.produit
    });
  }
}

// COMMANDES et LIGNE_COMMANDES - depuis historique
const commandes = [];
const ligneCommandes = [];
let commandeId = 1;
let ligneId = 1;

for (const cmd of historique.historique || []) {
  commandes.push({
    id: commandeId,
    user_name: cmd.user_name,
    user_phone: cmd.user_phone,
    user_image: cmd.user_image || "",
    time: cmd.time,
    date: cmd.date,
    lieu: cmd.lieu,
    price: cmd.price,
    createdAt: cmd.createdAt
  });

  for (const item of cmd.items || []) {
    ligneCommandes.push({
      id: ligneId++,
      commande_id: commandeId,
      produit_nom: item.name || "",
      quantity: item.quantity || 1,
      relatedItems: item.relatedItems || [],
      groupId: item.groupId || ""
    });
  }
  commandeId++;
}

// Écrire les fichiers JSON
const files = {
  categories: categories,
  tags: tags,
  garnitures: garnitures,
  produits: produits,
  produit_garnitures: produitGarnitures,
  produit_tags: produitTags,
  stocks: stocks,
  mouvements_stock: mouvementsStock,
  commandes: commandes,
  ligne_commandes: ligneCommandes
};

for (const [name, data] of Object.entries(files)) {
  const filePath = path.join(dbDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Créé: ${filePath}`);
}

console.log("\n✅ Migration terminée! Tous les fichiers sont dans src/data/db/");
