import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";
export const dynamic = "force-dynamic";

function extractDate(dateTime: string) {
  const date = new Date(dateTime);
  return date.toISOString().split("T")[0];
}

export async function POST(request: Request) {
  try {
    const nouvelleCommande = await request.json();
    const db = await getDb();

    const [rows] = await db.query(
      "SELECT id FROM commandes WHERE id = ? AND status = 'pret'",
      [nouvelleCommande.id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { message: "Commande non trouvée dans pretes." },
        { status: 404 }
      );
    }

    await db.query(
      "UPDATE commandes SET status = 'historique' WHERE id = ?",
      [nouvelleCommande.id]
    );

    const date = extractDate(nouvelleCommande.date);
    const lieu = nouvelleCommande.lieu;
    const price = parseFloat(
      nouvelleCommande.price.replace("€", "").replace(",", ".")
    );

    const [existing] = await db.query(
      "SELECT id, recette FROM recettes WHERE date = ? AND lieu = ?",
      [date, lieu]
    );
    const existingRow = (existing as any[])[0];

    if (existingRow) {
      const currentRecette = parseFloat(
        existingRow.recette.replace("€", "").replace(",", ".")
      );
      const newRecette = (currentRecette + price).toFixed(2) + "€";
      await db.query("UPDATE recettes SET recette = ? WHERE id = ?", [
        newRecette,
        existingRow.id,
      ]);
    } else {
      await db.query(
        "INSERT INTO recettes (date, lieu, recette) VALUES (?, ?, ?)",
        [date, lieu, price.toFixed(2) + "€"]
      );
    }

    return NextResponse.json(
      { message: "Commande ajoutée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de la commande." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();

    const [commandesRows] = await db.query(
      `SELECT * FROM commandes WHERE status = 'historique' ORDER BY createdAt DESC`
    );
    const commandes = commandesRows as any[];

    const historique: any[] = [];
    for (const row of commandes) {
      const [lignes] = await db.query(
        "SELECT produit_nom, quantity, relatedItems, groupId FROM ligne_commandes WHERE commande_id = ?",
        [row.id]
      );
      const items = (lignes as any[]).map((l) => ({
        name: l.produit_nom,
        quantity: l.quantity,
        relatedItems:
          typeof l.relatedItems === "string"
            ? JSON.parse(l.relatedItems || "[]")
            : l.relatedItems || [],
        groupId: l.groupId,
      }));

      historique.push({
        id: row.id,
        items,
        user_name: row.user_name,
        user_phone: row.user_phone,
        user_image: row.user_image,
        time: row.time,
        date: row.date,
        lieu: row.lieu,
        price: row.price,
        createdAt: row.createdAt,
      });
    }

    const [recettesRows] = await db.query("SELECT date, lieu, recette FROM recettes");
    const recettes = (recettesRows as any[]).map((r) => ({
      date: r.date,
      lieu: r.lieu,
      recette: r.recette,
    }));

    // Filtre : afficher les commandes des 30 derniers jours
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const filteredHistorique = historique.filter((entry: any) => {
      const entryTime = new Date(entry.createdAt).getTime();
      return now - entryTime <= THIRTY_DAYS;
    });

    return NextResponse.json(
      { historique: filteredHistorique, recettes },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de l'historique." },
      { status: 500 }
    );
  }
}
