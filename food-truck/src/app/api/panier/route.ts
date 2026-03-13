import { NextResponse } from "next/server";
import { getDb } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const [rows] = await db.query("SELECT items FROM panier WHERE id = 1");
    const row = (rows as any[])[0];
    const items = row?.items
      ? typeof row.items === "string"
        ? JSON.parse(row.items)
        : row.items
      : [];
    return NextResponse.json({ Panier: items });
  } catch (error) {
    console.error("Erreur GET panier:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération du panier" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { items, user_name, user_phone, user_image, time, date, lieu, price } =
      await request.json();

    if (!time || !user_name || !user_phone) {
      return NextResponse.json(
        { message: "L'horaire, le nom et le téléphone sont requis." },
        { status: 400 }
      );
    }

    const itemsWithGroupId = items.map((item: any) => {
      const groupId =
        item.groupId || `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const formattedRelatedItems = item.relatedItems?.map((related: any) => {
        if (typeof related === "string") {
          return { name: related, groupId };
        }
        return { ...related, groupId };
      });
      return {
        ...item,
        groupId,
        relatedItems: formattedRelatedItems || [],
      };
    });

    const newCommande = {
      id: Date.now(),
      items: itemsWithGroupId,
      user_name,
      user_phone,
      user_image,
      time,
      date,
      lieu,
      price,
      createdAt: new Date().toISOString(),
    };

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

    panierItems.push(newCommande);
    await db.query("UPDATE panier SET items = ? WHERE id = 1", [
      JSON.stringify(panierItems),
    ]);

    return NextResponse.json(
      { message: "Commande ajoutée ou mise à jour dans le panier.", panier: { Panier: panierItems } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur POST panier:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
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
          `INSERT INTO ligne_commandes (commande_id, produit_nom, quantity, relatedItems, groupId) 
           VALUES (?, ?, ?, ?, ?)`,
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
      { message: "Commande transférée vers préparation." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur PUT panier:", error);
    return NextResponse.json(
      { message: "Erreur lors du transfert.", error },
      { status: 500 }
    );
  }
}
