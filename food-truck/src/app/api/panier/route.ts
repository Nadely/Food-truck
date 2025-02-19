import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const panierFilePath = path.join(process.cwd(), "src/data/panier.json");
const preparationFilePath = path.join(process.cwd(), "src/data/preparation.json");

export async function POST(request: Request) {
  try {
    const { items, user_name, user_image, time, date, lieu, price } = await request.json();

    // Vérifier si l'heure est bien définie
    if (!time) {
      return NextResponse.json({ message: "L'horaire est requis." }, { status: 400 });
    }

    const panierData = fs.existsSync(panierFilePath)
      ? fs.readFileSync(panierFilePath, "utf-8")
      : '{"Panier": []}';

    const panier = JSON.parse(panierData);

    const newCommande = {
      id: Date.now(),
      items,
      user_name,
      user_image,
      time,
      date,
      lieu,
      price,
      createdAt: new Date().toISOString(),
    };

    panier.Panier.push(newCommande);

    fs.writeFileSync(panierFilePath, JSON.stringify(panier, null, 2), "utf-8");

    return NextResponse.json({ message: "Commande ajoutée au panier.", panier }, { status: 200 });
  } catch (error) {
    console.error("Erreur POST panier :", error);
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    console.log("Début de la requête PUT");

    // Log des chemins de fichiers
    console.log("Chemins de fichiers : ", panierFilePath, preparationFilePath);

    // Lire les fichiers JSON
    const panierData = fs.existsSync(panierFilePath)
      ? fs.readFileSync(panierFilePath, "utf-8")
      : '{"Panier": [{}]}';  // Ici, la clé doit être "Panier"
    const preparationData = fs.existsSync(preparationFilePath)
      ? fs.readFileSync(preparationFilePath, "utf-8")
      : '{"preparations": [{}]}';

    // Log des données lues
    console.log("Données lues : ", panierData, preparationData);

    const panier = JSON.parse(panierData);
    const preparation = JSON.parse(preparationData);

    // Vérification de la présence de la clé 'Panier' et si c'est un tableau
    if (!Array.isArray(panier.Panier)) {
      console.error("Erreur : panier.Panier n'est pas un tableau valide.");
      return NextResponse.json({ message: "Erreur dans la structure du panier.", error: "panier.Panier est invalide" }, { status: 500 });
    }

    if (!panier.Panier.length) {
      return NextResponse.json({ message: "Aucune commande à transférer." }, { status: 400 });
    }

    // Ajouter les commandes du panier à preparation.json
    preparation.preparations.push(...panier.Panier);
    console.log("Commandes ajoutées à preparation : ", preparation.preparations);

    // Vider panier.json
    try {
      fs.writeFileSync(panierFilePath, JSON.stringify({ Panier: [] }, null, 2), "utf-8");
      console.log("panier.json vidé avec succès");
    } catch (writeError) {
      console.error("Erreur d'écriture dans panier.json : ", writeError);
      return NextResponse.json({ message: "Erreur lors de l'écriture dans panier.json", error: writeError }, { status: 500 });
    }

    // Sauvegarder les nouvelles préparations dans preparation.json
    try {
      fs.writeFileSync(preparationFilePath, JSON.stringify(preparation, null, 2), "utf-8");
      console.log("preparation.json sauvegardé avec succès");
    } catch (writeError) {
      console.error("Erreur d'écriture dans preparation.json : ", writeError);
      return NextResponse.json({ message: "Erreur lors de l'écriture dans preparation.json", error: writeError }, { status: 500 });
    }

    return NextResponse.json({ message: "Commande transférée vers préparation.json." }, { status: 200 });
  } catch (error) {
    console.error("Erreur côté serveur : ", error.message, error.stack);
    return NextResponse.json({ message: "Erreur lors du transfert.", error: error.message }, { status: 500 });
  }
}
