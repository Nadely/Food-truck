import { getDataProduits } from "../src/data/db";
import { getDb } from "../src/lib/db";

async function importProduits() {
  const db = await getDb();

  const data = getDataProduits();

  for (const [categorie, produits] of Object.entries(data)) {
    for (const produit of produits) {
      const name = produit.name;
      const price = produit.price || "0";

      console.log(
        `Import : ${name} → ${price}`
      );

      /*
       * Recherche de la catégorie
       */
      const [categories] = await db.query(
        `
        SELECT id
        FROM categories
        WHERE LOWER(name) = LOWER(?)
        LIMIT 1
        `,
        [categorie]
      );

      let categorieId: number;

      if ((categories as any[]).length > 0) {
        categorieId =
          (categories as any[])[0].id;
      } else {
        const [result] = await db.query(
          `
          INSERT INTO categories (name)
          VALUES (?)
          `,
          [categorie]
        );

        categorieId =
          (result as any).insertId;
      }

      /*
       * Insertion / mise à jour du produit
       */
      await db.query(
        `
        INSERT INTO produits
          (name, price, categorie_id)
        VALUES
          (?, ?, ?)
        ON DUPLICATE KEY UPDATE
          price = VALUES(price),
          categorie_id = VALUES(categorie_id)
        `,
        [
          name,
          price,
          categorieId,
        ]
      );
    }
  }

  console.log(
    "Import des produits terminé."
  );

  await db.end();
}

importProduits().catch((error) => {
  console.error(
    "Erreur import produits :",
    error
  );

  process.exit(1);
});
