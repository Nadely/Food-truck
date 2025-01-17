// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";
// import productData from "@/data/products.json";

// export async function GET() {
//   return NextResponse.json(productData.products);
// }

// export async function PUT(request: Request) {
//   try {
//     const data = await request.json();
//     const filePath = path.join(process.cwd(), "src", "data", "products.json");
    
//     await fs.writeFile(
//       filePath,
//       JSON.stringify({ products: data.products }, null, 2)
//     );

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour des produits:", error);
//     return NextResponse.json(
//       { success: false, error: "Erreur lors de la mise à jour" },
//       { status: 500 }
//     );
//   }
// }