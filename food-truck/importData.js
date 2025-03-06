const mysql = require('mysql2/promise');
const fs = require('fs');

// Charger les données JSON
const data = JSON.parse(fs.readFileSync("src/data/dataProduits.json", "utf-8"));
const dataStock = JSON.parse(fs.readFileSync("src/data/products.json", "utf-8"));

// Connexion à la base de données
const dbConfig = {
  host: 'mysql-teamseniornad.alwaysdata.net',
  user: '397492_teams',
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

        await connection.query(
          "INSERT INTO dataProduits (name, image, price, categorie, garniture) VALUES (?, ?, ?, ?, ?)",
          [produit.name, produit.image, produit.price, categorie, garnitureText]
        );
      }
    }

    // Insertion des stocks
    for (const produit of dataStock.products) {
      const categoriesText = produit.categories ? JSON.stringify(produit.categories) : null;

      await connection.query(
        "INSERT INTO products (name, stock, stockConseil, lost, stockAnnuel, stockLimit, categories) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [produit.name, produit.stock, produit.stockConseil, produit.lost, produit.stockAnnuel, produit.stockLimit, categoriesText]
      );
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
