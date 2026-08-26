import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import { calculateCommandeTotal } from "../../../../lib/calculateCommandeTotal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { items } = await request.json();
    const db = await getDb();
    const { total, formatted } = await calculateCommandeTotal(db, items || []);
    return NextResponse.json({ total, formatted });
  } catch (error) {
    console.error("Erreur calcul total panier:", error);
    return NextResponse.json(
      { message: "Erreur lors du calcul du total" },
      { status: 500 }
    );
  }
}
