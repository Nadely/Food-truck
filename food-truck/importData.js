const mysql = require('mysql2/promise');
const fs = require('fs');

// Charger les données JSON
const data = JSON.parse(fs.readFileSync("src/data/dataProduits.json", "utf-8"));

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

    for (const [categorie, produits] of Object.entries(data)) {
      for (const produit of produits) {
        // Si garniture existe, on la convertit en format texte pour l'insertion
        const garnitureText = produit.garniture ? JSON.stringify(produit.garniture) : null;

        const [result] = await connection.query(
          "INSERT INTO dataProduits (name, image, price, categorie, garniture) VALUES (?, ?, ?, ?, ?)",
          [produit.name, produit.image, produit.price, categorie, garnitureText]
        );
        // On peut ajouter d'autres champs si nécessaire ici
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
