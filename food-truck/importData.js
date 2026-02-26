const mysql = require('mysql2/promise');
const fs = require('fs');

// Charger les données JSON
// Charger les données depuis la nouvelle structure DB
const path = require("path");
const fs = require("fs");
const dbDir = path.join(__dirname, "src/data/db");

function getDataProduits() {
  const categories = JSON.parse(fs.readFileSync(path.join(dbDir, "categories.json"), "utf-8"));
  const produits = JSON.parse(fs.readFileSync(path.join(dbDir, "produits.json"), "utf-8"));
  const garnitures = JSON.parse(fs.readFileSync(path.join(dbDir, "garnitures.json"), "utf-8"));
  const produitGarnitures = JSON.parse(fs.readFileSync(path.join(dbDir, "produit_garnitures.json"), "utf-8"));
  const produitTags = JSON.parse(fs.readFileSync(path.join(dbDir, "produit_tags.json"), "utf-8"));
  const tags = JSON.parse(fs.readFileSync(path.join(dbDir, "tags.json"), "utf-8"));
  const stocks = JSON.parse(fs.readFileSync(path.join(dbDir, "stocks.json"), "utf-8"));

  const result = {};
  for (const cat of categories) {
    result[cat.name] = produits
      .filter((p) => p.categorie_id === cat.id)
      .map((p) => {
        const stock = stocks.find((s) => s.produit_id === p.id);
        const garnitureIds = produitGarnitures
          .filter((pg) => pg.produit_id === p.id)
          .map((pg) => garnitures.find((g) => g.id === pg.garniture_id))
          .filter(Boolean);
        const tagNames = produitTags
          .filter((pt) => pt.produit_id === p.id)
          .map((pt) => tags.find((t) => t.id === pt.tag_id)?.name)
          .filter(Boolean);
        return {
          id: p.id,
          name: p.name,
          image: p.image || "",
          price: p.price || "",
          categorie: cat.name,
          garniture: garnitureIds.map((g) => ({ id: g.id, name: g.name, image: g.image })),
          stock: stock?.quantite ?? 20,
          stockConseil: stock?.stockConseil ?? 0,
          lost: stock?.lost ?? 0,
          stockAnnuel: stock?.stockAnnuel ?? 20,
          stockLimite: stock?.stockLimite ?? 0,
          categories: tagNames,
        };
      });
  }
  return result;
}

const data = getDataProduits();
const dataStock = JSON.parse(fs.readFileSync("src/data/products.json", "utf-8"));

// Connexion à la base de données
const dbConfig = {
  host: 'mysql-teamseniornad.alwaysdata.net',
  user: '449602',
  password: 'Enola2908@',
  database: 'teamseniornad_foodtruck_db'
};

async function insertData() {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Insertion des produits
    for (const [categorie, produits] of Object.entries(data)) {
      for (const produit of produits) {
        // Convertir la garniture en JSON string si elle existe
        const garnitureText = produit.garniture ? JSON.stringify(produit.garniture) : null;
        const categoriesText = produit.categories ? JSON.stringify(produit.categories) : null;
        const stockLimit = produit.stockLimite ? produit.stockLimite : 0;
        const stock = produit.stock ? produit.stock : 20;
        const stockConseil = produit.stockConseil ? produit.stockConseil : 0;
        const lost = produit.lost ? produit.lost : 0;
        const stockAnnuel = produit.stockAnnuel ? produit.stockAnnuel : 20;
        
        await connection.query(
          "INSERT INTO dataProduits (name, image, price, categorie, garniture, stock, stockConseil, lost, stockAnnuel, stockLimit, categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [produit.name, produit.image, produit.price, categorie, garnitureText, produit.stock, produit.stockConseil, produit.lost, produit.stockAnnuel, produit.stockLimit, categoriesText]
        );
      }
    }

    console.log("Import terminé !");
    process.exit();
  } catch (error) {
    console.error("Erreur lors de l'import :", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertData();
