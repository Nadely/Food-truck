import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const [commandes] = await db.query(
      `SELECT c.* FROM commandes c 
       WHERE c.status IN ('preparation', 'pret') 
       ORDER BY c.createdAt ASC`
    );
    const rows = commandes as any[];

    const preparations: any[] = [];
    const pretes: any[] = [];

    for (const row of rows) {
      const [lignes] = await db.query(
        "SELECT produit_nom, quantity, relatedItems, groupId FROM ligne_commandes WHERE commande_id = ?",
        [row.id]
      );
      const items = (lignes as any[]).map((l) => ({
        name: l.produit_nom,
        quantity: l.quantity,
        relatedItems: typeof l.relatedItems === "string" ? JSON.parse(l.relatedItems || "[]") : l.relatedItems || [],
        groupId: l.groupId,
      }));

      const commande = {
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
      };

      if (row.status === "preparation") {
        preparations.push(commande);
      } else {
        pretes.push(commande);
      }
    }

    return NextResponse.json({ preparations, pretes });
  } catch (error) {
    console.error("Erreur GET preparation:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des préparations" },
      { status: 500 }
    );
  }
}
