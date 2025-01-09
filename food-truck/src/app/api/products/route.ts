import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "src/data/products.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(fileContent);
  return NextResponse.json(data.products);
}

export async function PUT(request: Request) {
  try {
    const { products } = await request.json();
    const filePath = path.join(process.cwd(), "src/data/products.json");

    await fs.writeFile(
      filePath,
      JSON.stringify({ products }, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
