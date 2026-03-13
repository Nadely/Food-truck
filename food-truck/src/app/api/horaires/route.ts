import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDb();

    const [rows] = await db.query("SELECT items FROM panier WHERE id = 1");
    let panierItems: any[] = [];
    if ((rows as any[]).length > 0) {
      const row = (rows as any[])[0];
      panierItems = row?.items
        ? typeof row.items === "string"
          ? JSON.parse(row.items)
          : row.items
        : [];
    } else {
      await db.query("INSERT INTO panier (id, items) VALUES (1, ?)", [
        JSON.stringify([]),
      ]);
    }

    const existingIndex = panierItems.findIndex((item: any) => item.id === body.id);
    if (existingIndex !== -1) {
      panierItems[existingIndex] = body;
    } else {
      panierItems.push(body);
    }

    await db.query("UPDATE panier SET items = ? WHERE id = 1", [
      JSON.stringify(panierItems),
    ]);

    return NextResponse.json(
      { message: "✅ Commande ajoutée dans le panier." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la commande:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de la commande.", error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getDb();
    const [rows] = await db.query("SELECT items FROM panier WHERE id = 1");
    const row = (rows as any[])[0];
    const panierItems = row?.items
      ? typeof row.items === "string"
        ? JSON.parse(row.items)
        : row.items
      : [];

    if (!Array.isArray(panierItems) || panierItems.length === 0) {
      return NextResponse.json(
        { message: "Aucune commande à transférer." },
        { status: 400 }
      );
    }

    for (const cmd of panierItems) {
      await db.query(
        `INSERT INTO commandes (id, user_name, user_phone, user_image, time, date, lieu, price, createdAt, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'preparation')`,
        [
          cmd.id,
          cmd.user_name || null,
          cmd.user_phone || null,
          cmd.user_image || null,
          cmd.time || null,
          cmd.date || null,
          cmd.lieu || null,
          cmd.price || null,
          cmd.createdAt || null,
        ]
      );
      for (const item of cmd.items || []) {
        const relatedItemsJson = item.relatedItems
          ? JSON.stringify(item.relatedItems)
          : null;
        await db.query(
          `INSERT INTO ligne_commandes (commande_id, produit_nom, quantity, relatedItems, groupId) VALUES (?, ?, ?, ?, ?)`,
          [
            cmd.id,
            item.name || null,
            item.quantity ?? 1,
            relatedItemsJson,
            item.groupId || null,
          ]
        );
      }
    }

    await db.query("UPDATE panier SET items = ? WHERE id = 1", [
      JSON.stringify([]),
    ]);

    return NextResponse.json(
      { message: "✅ Commande transférée vers preparation." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du transfert:", error);
    return NextResponse.json(
      { message: "Erreur lors du transfert.", error },
      { status: 500 }
    );
  }
}
