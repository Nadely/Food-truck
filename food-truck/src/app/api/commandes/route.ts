import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { commandeId } = await request.json();
    const db = await getDb();

    const [rows] = await db.query(
      "SELECT id FROM commandes WHERE id = ? AND status = 'preparation'",
      [commandeId]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { message: "Commande non trouvée." },
        { status: 404 }
      );
    }

    await db.query("UPDATE commandes SET status = 'pret' WHERE id = ?", [
      commandeId,
    ]);

    return NextResponse.json(
      { message: "Commande déplacée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors du déplacement de la commande." },
      { status: 500 }
    );
  }
}
