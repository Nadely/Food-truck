import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src/data/dataProduits.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Transformer les données en format plat pour la compatibilité
    const products = Object.entries(data).flatMap(([category, products]) => {
      return (products as any[])
        // Exclure les éléments "Aucun(s)"
        .filter(product => !product.name.toLowerCase().includes("aucun"))
        // Inclure uniquement les produits nécessaires pour les stocks
        .filter(product => {
          const name = product.name.toLowerCase();
          // Exclure les burgers spécifiques
          if (name.includes("fish burger") ||
              name.includes("chicken burger") ||
              name.includes("crispy burger")) {
            return false;
          }
          // Inclure les pains et steaks
          if (name.includes("pain") ||
              name.includes("steak") ||
              name.includes("fish") ||
              name.includes("chicken") ||
              name.includes("crispy") ||
              name.includes("mexicain")) {
            return true;
          }
          // Exclure les mitraillettes et burgers
          if (name.includes("mitraillette") ||
              name.includes("burger") ||
              name.includes("classique") ||
              name.includes("filet americain") ||
              name.includes("brochette")) {
            return false;
          }
          // Inclure tous les autres produits
          return true;
        })
        .map(product => ({
          id: parseInt(`${category.toLowerCase().charCodeAt(0)}${product.id}`),
          name: product.name,
          image: product.image,
          price: product.price,
          categories: product.categories || [category.toLowerCase()],
          stock: product.stock || 20,
          stockConseil: product.stockConseil || 0,
          lost: product.lost || 0,
          stockAnnuel: product.stockAnnuel || 20,
          stockLimite: product.stockLimite || 0
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
    const filePath = path.join(process.cwd(), "src/data/dataProduits.json");

    // Lire le fichier actuel
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Mettre à jour les stocks pour chaque produit
    for (const category in data) {
      data[category] = data[category].map(product => {
        // Trouver le produit mis à jour en comparant les noms
        const updatedProduct = products.find(p =>
          p.name.toLowerCase().trim() === product.name.toLowerCase().trim()
        );

        if (updatedProduct) {
          console.log(`📦 Mise à jour du stock pour ${product.name}:`, {
            ancienStock: product.stock,
            nouveauStock: updatedProduct.stock,
            categorie: category
          });

          // Mettre à jour uniquement le stock
          return {
            ...product,
            stock: updatedProduct.stock
          };
        }
        return product;
      });
    }

    // Sauvegarder les modifications
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("✅ Stocks mis à jour avec succès dans dataProduits.json");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
