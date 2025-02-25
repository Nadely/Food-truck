import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const panierFilePath = path.join(process.cwd(), "src/data/panier.json");
const preparationFilePath = path.join(process.cwd(), "src/data/preparation.json");

export async function PUT(request: Request) {
  try {
    console.log("📌 Début du transfert du panier vers preparation.json");

    // Lire les fichiers JSON
    const panierData = fs.existsSync(panierFilePath)
      ? fs.readFileSync(panierFilePath, "utf-8")
      : '{"Panier": []}';
    const preparationData = fs.existsSync(preparationFilePath)
      ? fs.readFileSync(preparationFilePath, "utf-8")
      : '{"preparations": []}';

    const panier = JSON.parse(panierData);
    const preparation = JSON.parse(preparationData);

    console.log("📌 Contenu actuel du panier :", panier.Panier);

    if (!Array.isArray(panier.Panier) || panier.Panier.length === 0) {
      return NextResponse.json(
        { message: "⚠ Aucune commande à transférer." },
        { status: 400 }
      );
    }

    // Ajouter les commandes du panier à preparation.json
    preparation.preparations.push(...panier.Panier);

    console.log("📌 Nouvelle liste des préparations :", preparation.preparations);

    // Vider panier.json après le transfert
    fs.writeFileSync(panierFilePath, JSON.stringify({ Panier: [] }, null, 2), "utf-8");
    console.log("✅ panier.json vidé avec succès");

    // Sauvegarder dans preparation.json
    fs.writeFileSync(preparationFilePath, JSON.stringify(preparation, null, 2), "utf-8");
    console.log("✅ preparation.json mis à jour avec succès");

    return NextResponse.json(
      { message: "✅ Commande transférée vers preparation.json." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur lors du transfert :", error);
    return NextResponse.json(
      { message: "❌ Erreur lors du transfert.", error },
      { status: 500 }
    );
  }
}
