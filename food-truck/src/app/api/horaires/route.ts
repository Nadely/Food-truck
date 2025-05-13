import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const panierFilePath = path.join(process.cwd(), "src/data/panier.json");
const preparationFilePath = path.join(process.cwd(), "src/data/preparation.json");

// POST : Ajouter ou mettre à jour une commande dans le panier
export async function POST(request: Request) {
  try {
    console.log("📌 Ajout d'une nouvelle commande dans le panier");

    const body = await request.json();
    console.log("📌 Corps de la requête :", body);

    // Lire le contenu actuel du panier
    const panierData = fs.existsSync(panierFilePath)
      ? fs.readFileSync(panierFilePath, "utf-8")
      : '{"Panier": []}';
    const panier = JSON.parse(panierData);

    // Si une commande avec le même ID existe, on la met à jour, sinon on l'ajoute
    const existingIndex = panier.Panier.findIndex((item: any) => item.id === body.id);
    if (existingIndex !== -1) {
      panier.Panier[existingIndex] = body;
      console.log("🔄 Commande mise à jour dans le panier.");
    } else {
      panier.Panier.push(body);
      console.log("➕ Commande ajoutée dans le panier.");
    }

    // Sauvegarder le panier mis à jour
    fs.writeFileSync(panierFilePath, JSON.stringify(panier, null, 2), "utf-8");

    return NextResponse.json(
      { message: "✅ Commande ajoutée dans le panier." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout de la commande :", error);
    return NextResponse.json(
      { message: "❌ Erreur lors de l'ajout de la commande.", error },
      { status: 500 }
    );
  }
}

// PUT : Transférer le panier vers preparation.json et vider le panier
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

    // Ajouter les commandes du panier au tableau des préparations
    preparation.preparations.push(...panier.Panier);
    console.log("📌 Nouvelle liste des préparations :", preparation.preparations);

    // Vider le panier
    fs.writeFileSync(panierFilePath, JSON.stringify({ Panier: [] }, null, 2), "utf-8");
    console.log("✅ panier.json vidé avec succès");

    // Sauvegarder le fichier preparation.json mis à jour
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
