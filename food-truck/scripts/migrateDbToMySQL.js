/**
 * Script de migration : crée la nouvelle structure DB sur MySQL et insère les données
 *
 * Schéma:
 * CATEGORIES ───< PRODUITS >── PRODUIT_GARNITURES >── GARNITURES
 *                      |        PRODUIT_TAGS >── TAGS
 *                      |        STOCKS >── MOUVEMENTS_STOCK
 * COMMANDES ───< LIGNE_COMMANDES
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

const dbDir = path.join(__dirname, "../src/data/db");

const dbConfig = {
  host: "mysql-teamseniornad.alwaysdata.net",
  user: "449602",
  password: "Enola2908@",
  database: "teamseniornad_foodtruck_db",
  multipleStatements: true,
};

function loadJson(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(dbDir, filename), "utf-8")
  );
}

async function run() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connexion MySQL établie\n");

    // 1. Supprimer les anciennes tables (ordre inverse des FK)
    console.log("🗑️  Suppression des anciennes tables...");
    await connection.query(`
      SET FOREIGN_KEY_CHECKS = 0;
      DROP TABLE IF EXISTS ligne_commandes;
      DROP TABLE IF EXISTS mouvements_stock;
      DROP TABLE IF EXISTS stocks;
      DROP TABLE IF EXISTS produit_tags;
      DROP TABLE IF EXISTS produit_garnitures;
      DROP TABLE IF EXISTS produits;
      DROP TABLE IF EXISTS garnitures;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS categories;
      DROP TABLE IF EXISTS commandes;
      DROP TABLE IF EXISTS panier;
      DROP TABLE IF EXISTS recettes;
      SET FOREIGN_KEY_CHECKS = 1;
    `);
    console.log("   Tables supprimées\n");

    // 2. Créer les tables
    console.log("📦 Création des tables...");

    await connection.query(`
      CREATE TABLE categories (
        id INT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE tags (
        id INT PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );

      CREATE TABLE garnitures (
        id INT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image VARCHAR(255)
      );

      CREATE TABLE produits (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        price VARCHAR(20),
        categorie_id INT,
        FOREIGN KEY (categorie_id) REFERENCES categories(id)
      );

      CREATE TABLE produit_garnitures (
        produit_id INT,
        garniture_id INT,
        PRIMARY KEY (produit_id, garniture_id),
        FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
        FOREIGN KEY (garniture_id) REFERENCES garnitures(id) ON DELETE CASCADE
      );

      CREATE TABLE produit_tags (
        produit_id INT,
        tag_id INT,
        PRIMARY KEY (produit_id, tag_id),
        FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      );

      CREATE TABLE stocks (
        id INT PRIMARY KEY,
        produit_id INT NOT NULL,
        quantite INT DEFAULT 20,
        stockConseil INT DEFAULT 0,
        lost INT DEFAULT 0,
        stockAnnuel INT DEFAULT 20,
        stockLimite INT DEFAULT 15,
        FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
      );

      CREATE TABLE mouvements_stock (
        id INT PRIMARY KEY,
        stock_id INT NULL,
        type VARCHAR(50),
        quantite INT,
        date VARCHAR(50),
        produit_nom VARCHAR(255),
        FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE SET NULL
      );

      CREATE TABLE commandes (
        id BIGINT PRIMARY KEY,
        user_name VARCHAR(100),
        user_phone VARCHAR(50),
        user_image VARCHAR(255),
        time VARCHAR(20),
        date VARCHAR(50),
        lieu VARCHAR(100),
        price VARCHAR(20),
        createdAt VARCHAR(50),
        status VARCHAR(20) DEFAULT 'historique'
      );

      CREATE TABLE ligne_commandes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        commande_id BIGINT NOT NULL,
        produit_nom VARCHAR(255),
        quantity INT DEFAULT 1,
        relatedItems JSON,
        groupId VARCHAR(100),
        FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
      );

      DROP TABLE IF EXISTS panier;
      CREATE TABLE panier (
        id INT PRIMARY KEY DEFAULT 1,
        items JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      DROP TABLE IF EXISTS recettes;
      CREATE TABLE recettes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date VARCHAR(20),
        lieu VARCHAR(100),
        recette VARCHAR(20)
      );
    `);
    console.log("   Tables créées\n");

    // 3. Insérer les données
    console.log("📥 Insertion des données...");

    const categories = loadJson("categories.json");
    for (const row of categories) {
      await connection.query(
        "INSERT INTO categories (id, name) VALUES (?, ?)",
        [row.id, row.name]
      );
    }
    console.log(`   → ${categories.length} catégories`);

    const tags = loadJson("tags.json");
    for (const row of tags) {
      await connection.query(
        "INSERT INTO tags (id, name) VALUES (?, ?)",
        [row.id, row.name]
      );
    }
    console.log(`   → ${tags.length} tags`);

    const garnitures = loadJson("garnitures.json");
    for (const row of garnitures) {
      await connection.query(
        "INSERT INTO garnitures (id, name, image) VALUES (?, ?, ?)",
        [row.id, row.name, row.image || ""]
      );
    }
    console.log(`   → ${garnitures.length} garnitures`);

    const produits = loadJson("produits.json");
    for (const row of produits) {
      await connection.query(
        "INSERT INTO produits (id, name, image, price, categorie_id) VALUES (?, ?, ?, ?, ?)",
        [
          row.id,
          row.name,
          row.image || "",
          row.price || "",
          row.categorie_id,
        ]
      );
    }
    console.log(`   → ${produits.length} produits`);

    const produitGarnitures = loadJson("produit_garnitures.json");
    for (const row of produitGarnitures) {
      await connection.query(
        "INSERT INTO produit_garnitures (produit_id, garniture_id) VALUES (?, ?)",
        [row.produit_id, row.garniture_id]
      );
    }
    console.log(`   → ${produitGarnitures.length} produit_garnitures`);

    const produitTags = loadJson("produit_tags.json");
    for (const row of produitTags) {
      await connection.query(
        "INSERT INTO produit_tags (produit_id, tag_id) VALUES (?, ?)",
        [row.produit_id, row.tag_id]
      );
    }
    console.log(`   → ${produitTags.length} produit_tags`);

    const stocks = loadJson("stocks.json");
    for (const row of stocks) {
      await connection.query(
        `INSERT INTO stocks (id, produit_id, quantite, stockConseil, lost, stockAnnuel, stockLimite) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.produit_id,
          row.quantite ?? 20,
          row.stockConseil ?? 0,
          row.lost ?? 0,
          row.stockAnnuel ?? 20,
          row.stockLimite ?? 15,
        ]
      );
    }
    console.log(`   → ${stocks.length} stocks`);

    const mouvementsStock = loadJson("mouvements_stock.json");
    const validStockIds = new Set(stocks.map((s) => s.id));
    for (const row of mouvementsStock) {
      const stockId = validStockIds.has(row.stock_id) ? row.stock_id : null;
      await connection.query(
        `INSERT INTO mouvements_stock (id, stock_id, type, quantite, date, produit_nom) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          stockId,
          row.type || "",
          row.quantite,
          row.date || null,
          row.produit_nom || null,
        ]
      );
    }
    console.log(`   → ${mouvementsStock.length} mouvements_stock`);

    // Charger preparation.json, historique.json, panier.json depuis src/data
    const dataDir = path.join(__dirname, "../src/data");
    const preparation = JSON.parse(
      fs.readFileSync(path.join(dataDir, "preparation.json"), "utf-8")
    );
    const historique = JSON.parse(
      fs.readFileSync(path.join(dataDir, "historique.json"), "utf-8")
    );
    const panierData = JSON.parse(
      fs.readFileSync(path.join(dataDir, "panier.json"), "utf-8")
    );

    // Insérer les commandes historique depuis historique.json
    for (const row of historique.historique || []) {
      await connection.query(
        `INSERT INTO commandes (id, user_name, user_phone, user_image, time, date, lieu, price, createdAt, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'historique')`,
        [
          row.id,
          row.user_name || null,
          row.user_phone || null,
          row.user_image || null,
          row.time || null,
          row.date || null,
          row.lieu || null,
          row.price || null,
          row.createdAt || null,
        ]
      );
      for (const item of row.items || []) {
        const relatedItemsJson = item.relatedItems
          ? JSON.stringify(item.relatedItems)
          : null;
        await connection.query(
          `INSERT INTO ligne_commandes (commande_id, produit_nom, quantity, relatedItems, groupId) VALUES (?, ?, ?, ?, ?)`,
          [row.id, item.name || null, item.quantity ?? 1, relatedItemsJson, item.groupId || null]
        );
      }
    }

    for (const cmd of preparation.preparations || []) {
      await connection.query(
        `INSERT INTO commandes (id, user_name, user_phone, user_image, time, date, lieu, price, createdAt, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'preparation')`,
        [
          cmd.id,
          cmd.user_name || null,
          cmd.user_phone || null,
          cmd.user_image || null,
          cmd.time || null,
          cmd.date || null,
          cmd.lieu || null,
          cmd.price || null,
          cmd.createdAt || null,
        ]
      );
      for (const item of cmd.items || []) {
        const relatedItemsJson = item.relatedItems
          ? JSON.stringify(item.relatedItems)
          : null;
        await connection.query(
          `INSERT INTO ligne_commandes (commande_id, produit_nom, quantity, relatedItems, groupId) VALUES (?, ?, ?, ?, ?)`,
          [cmd.id, item.name || null, item.quantity ?? 1, relatedItemsJson, item.groupId || null]
        );
        ligneId++;
      }
    }
    for (const cmd of preparation.pretes || []) {
      await connection.query(
        `INSERT INTO commandes (id, user_name, user_phone, user_image, time, date, lieu, price, createdAt, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pret')`,
        [
          cmd.id,
          cmd.user_name || null,
          cmd.user_phone || null,
          cmd.user_image || null,
          cmd.time || null,
          cmd.date || null,
          cmd.lieu || null,
          cmd.price || null,
          cmd.createdAt || null,
        ]
      );
      for (const item of cmd.items || []) {
        const relatedItemsJson = item.relatedItems
          ? JSON.stringify(item.relatedItems)
          : null;
        await connection.query(
          `INSERT INTO ligne_commandes (commande_id, produit_nom, quantity, relatedItems, groupId) VALUES (?, ?, ?, ?, ?)`,
          [cmd.id, item.name || null, item.quantity ?? 1, relatedItemsJson, item.groupId || null]
        );
      }
    }
    console.log(
      `   → ${(historique.historique || []).length} + ${(preparation.preparations || []).length + (preparation.pretes || []).length} commandes (historique + prep + pretes)`
    );

    await connection.query(
      "INSERT INTO panier (id, items) VALUES (1, ?)",
      [JSON.stringify(panierData.Panier || [])]
    );
    console.log("   → panier");

    for (const r of historique.recettes || []) {
      await connection.query(
        "INSERT INTO recettes (date, lieu, recette) VALUES (?, ?, ?)",
        [r.date || null, r.lieu || null, r.recette || null]
      );
    }
    console.log(`   → ${(historique.recettes || []).length} recettes`);

    console.log("\n✅ Migration terminée avec succès !");
  } catch (error) {
    console.error("\n❌ Erreur:", error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    process.exit(0);
  }
}

run();
