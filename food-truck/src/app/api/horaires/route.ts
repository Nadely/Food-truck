import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request) {
  try {
    const panierFilePath = path.join(process.cwd(), "src/data/panier.json");
    const preparationFilePath = path.join(
      process.cwd(),
      "src/data/preparation.json"
    );

    // Lire les fichiers JSON
    const panierData = fs.existsSync(panierFilePath)
      ? fs.readFileSync(panierFilePath, "utf-8")
      : '{"panier": []}';
    const preparationData = fs.existsSync(preparationFilePath)
      ? fs.readFileSync(preparationFilePath, "utf-8")
      : '{"preparations": []}';

    const panier = JSON.parse(panierData);
    const preparation = JSON.parse(preparationData);

    if (!panier.panier.length) {
      return NextResponse.json(
        { message: "Aucune commande à transférer." },
        { status: 400 }
      );
    }

    // Ajouter les commandes du panier à preparation.json
    preparation.preparations.push(...panier.panier);

    // Vider panier.json
    fs.writeFileSync(panierFilePath, JSON.stringify({ panier: [] }, null, 2));

    // Sauvegarder les nouvelles préparations
    fs.writeFileSync(
      preparationFilePath,
      JSON.stringify(preparation, null, 2)
    );

    return NextResponse.json(
      { message: "Commande transférée vers préparation.json." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors du transfert.", error },
      { status: 500 }
    );
  }
}
