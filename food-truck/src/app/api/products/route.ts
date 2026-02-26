import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDataProduits } from "../../../data/db";

const DB_DIR = "src/data/db";

export async function GET() {
  try {
    const data = getDataProduits();

    // Transformer les données en format plat pour la compatibilité
    const products = Object.entries(data).flatMap(([category, products]) => {
      return (products as any[])
        // Exclure les éléments "Aucun(s)" sauf "Aucune sauce" et "Aucune boisson"
        .filter((product) => {
          const name = product.name.toLowerCase();
          return (
            name === "aucune sauce" ||
            name === "aucune boisson" ||
            !name.includes("aucun")
          );
        })
        // Inclure uniquement les produits nécessaires pour les stocks
        .filter((product) => {
          const name = product.name.toLowerCase();
          // Exclure les burgers spécifiques
          if (
            name.includes("fish burger") ||
            name.includes("chicken burger") ||
            name.includes("crispy burger")
          ) {
            return false;
          }
          // Inclure les pains et steaks
          if (
            name.includes("pain") ||
            name.includes("steak") ||
            name.includes("fish") ||
            name.includes("chicken") ||
            name.includes("crispy") ||
            name.includes("mexicain")
          ) {
            return true;
          }
          // Exclure les mitraillettes et burgers
          if (
            name.includes("mitraillette") ||
            name.includes("burger") ||
            name.includes("classique") ||
            name.includes("filet americain") ||
            name.includes("brochette")
          ) {
            return false;
          }
          // Inclure tous les autres produits
          return true;
        })
        .map((product) => ({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          categories: product.categories || [category.toLowerCase()],
          stock: product.stock || 20,
          stockConseil: product.stockConseil || 0,
          lost: product.lost || 0,
          stockAnnuel: product.stockAnnuel || 20,
          stockLimite: product.stockLimite || 0,
        }));
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { products } = await request.json();
    const stocksPath = path.join(process.cwd(), DB_DIR, "stocks.json");
    const produitsPath = path.join(process.cwd(), DB_DIR, "produits.json");

    // Lire les fichiers
    const stocksContent = await fs.readFile(stocksPath, "utf-8");
    const produitsContent = await fs.readFile(produitsPath, "utf-8");
    const stocks = JSON.parse(stocksContent);
    const produits = JSON.parse(produitsContent);

    // Créer une map produit_id -> nom
    const produitNames = new Map(
      produits.map((p: any) => [p.id, p.name.toLowerCase().trim()])
    );

    // Mettre à jour les stocks
    for (const stock of stocks) {
      const produitName = produitNames.get(stock.produit_id);
      const updatedProduct = products.find(
        (p: any) => p.name.toLowerCase().trim() === produitName
      );

      if (updatedProduct) {
        console.log(`📦 Mise à jour du stock pour ${updatedProduct.name}:`, {
          ancienStock: stock.quantite,
          nouveauStock: updatedProduct.stock,
        });
        stock.quantite = updatedProduct.stock;
      }
    }

    // Sauvegarder
    await fs.writeFile(stocksPath, JSON.stringify(stocks, null, 2), "utf-8");
    console.log("✅ Stocks mis à jour avec succès dans stocks.json");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
