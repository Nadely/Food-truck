"use server";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/data/losses-history.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContent);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Créer le dossier stocks/api s'il n'existe pas
    const dataDir = path.join(process.cwd(), "src", "data");
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, "losses-history.json");

    // Lire le fichier existant ou créer un nouveau tableau
    let history = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      history = JSON.parse(fileContent);
    } catch {
      // Le fichier n'existe pas encore, on continue avec un tableau vide
    }

    // Ajouter les nouvelles pertes
    history.push(data);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Erreur API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Une erreur est survenue";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}


