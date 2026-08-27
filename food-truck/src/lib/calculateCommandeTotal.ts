import type { Pool } from "mysql2/promise";

function parsePrice(price: any): number {
  if (price === null || price === undefined || price === "") {
    return 0;
  }

  if (typeof price === "number") {
    return Number.isFinite(price) ? price : 0;
  }

  const value = Number(
    String(price)
      .replace("€", "")
      .replace(",", ".")
      .trim()
  );

  return Number.isFinite(value) ? value : 0;
}

function isSauce(item: any): boolean {
  return (
    item?.isSauce === true ||
    item?.isSauces === true ||
    item?.uniqueId?.toString().startsWith("sauce-") ||
    item?.categorie?.toString().toLowerCase().includes("sauce") ||
    item?.name?.toString().toLowerCase().includes("sauce")
  );
}

function getSaucePrice(sauce: any): number {
  if (!sauce) {
    return 0;
  }

  const sauceName = sauce.name?.toString().trim().toLowerCase();

  // Aucune sauce = TOUJOURS 0 €
  if (sauceName === "aucune sauce") {
    return 0;
  }

  // Sauce explicitement gratuite
  if (
    sauce.isFree === true ||
    sauce.free === true ||
    sauce.isGratuit === true
  ) {
    return 0;
  }

  return parsePrice(sauce.price);
}

export async function calculateCommandeTotal(
  db: Pool,
  items: any[]
): Promise<{
  total: number;
  formatted: string;
}> {
  if (!Array.isArray(items)) {
    return {
      total: 0,
      formatted: "0.00€",
    };
  }

  let total = 0;

  for (const item of items) {
    if (!item) {
      continue;
    }

    const quantity = Math.max(
      1,
      Number(item.quantity ?? 1)
    );

    /*
    ========================================================
    SAUCE
    ========================================================
    */

    if (isSauce(item)) {
      const saucePrice = getSaucePrice(item);
      const sauceTotal = saucePrice * quantity;

      console.log("🥫 SAUCE :", {
        id: item?.id,
        uniqueId: item?.uniqueId,
        name: item?.name,
        priceOriginal: item?.price,
        priceFinal: saucePrice,
        quantity,
        total: sauceTotal,
        isFree: item?.isFree,
        free: item?.free,
        isGratuit: item?.isGratuit,
      });

      total += sauceTotal;
      continue;
    }

    /*
    ========================================================
    SUPPLÉMENT
    ========================================================
    */

    if (item?.isSupplements === true) {
      // Cas d'un conteneur de suppléments avec des relatedItems
      if (Array.isArray(item.relatedItems) && item.relatedItems.length > 0) {
        const supplementsTotal = item.relatedItems.reduce(
          (sum: number, related: any) => {
            if (!related || related.isSupplements !== true) {
              return sum;
            }

            const supplementPrice = parsePrice(related.price);
            const supplementQuantity = Math.max(
              1,
              Number(related.quantity ?? 1)
            );

            return sum + supplementPrice * supplementQuantity;
          },
          0
        );

        const lineTotal = supplementsTotal * quantity;

        console.log("➕ SUPPLÉMENTS DU CONTENEUR :", {
          name: item.name,
          quantity,
          supplementsTotal,
          total: lineTotal,
          relatedItems: item.relatedItems,
        });

        total += lineTotal;
        continue;
      }

      // Cas d'un supplément seul
      const itemPrice = parsePrice(item.price);
      const lineTotal = itemPrice * quantity;

      console.log("➕ SUPPLÉMENT SEUL :", {
        name: item.name,
        price: itemPrice,
        quantity,
        total: lineTotal,
      });

      total += lineTotal;
      continue;
    }

    /*
    ========================================================
    PRODUIT PRINCIPAL
    ========================================================
    */

    const itemPrice = parsePrice(item.price);
    let relatedTotal = 0;

    /*
    ========================================================
    RELATED ITEMS
    ========================================================
    */

    for (const related of item?.relatedItems ?? []) {
      if (!related) {
        continue;
      }

      /*
      ======================================================
      SAUCE
      ======================================================
      */

      if (isSauce(related)) {
        const saucePrice = getSaucePrice(related);

        const sauceQuantity = Math.max(
          1,
          Number(related.quantity ?? 1)
        );

        const sauceTotal =
          saucePrice * sauceQuantity;

        console.log("🥫 SAUCE RELATED :", {
          parent: item.name,
          sauce: related.name,
          priceOriginal: related.price,
          priceFinal: saucePrice,
          quantity: sauceQuantity,
          total: sauceTotal,
          isFree: related?.isFree,
          free: related?.free,
          isGratuit: related?.isGratuit,
        });

        relatedTotal += sauceTotal;
        continue;
      }

      /*
      ======================================================
      FRITES INCLUSES
      ======================================================
      */

      if (related?.isFrites) {
        continue;
      }

      /*
      ======================================================
      GARNITURE INCLUSE
      ======================================================
      */

      if (related?.isGarniture) {
        continue;
      }

      /*
      ======================================================
      BOISSON INCLUSE
      ======================================================
      */

      if (related?.isBoisson) {
        continue;
      }

      /*
      ======================================================
      SNACK INCLUS
      ======================================================
      */

      const categorie =
        related?.categorie
          ?.toString()
          .toLowerCase() || "";

      if (categorie.includes("snack")) {
        continue;
      }

      /*
      ======================================================
      SUPPLÉMENT
      ======================================================
      */

      if (related?.isSupplements === true) {
        const supplementPrice =
          parsePrice(related.price);

        const supplementQuantity = Math.max(
          1,
          Number(related.quantity ?? 1)
        );

        const supplementTotal =
          supplementPrice * supplementQuantity;

        relatedTotal += supplementTotal;

        console.log("➕ SUPPLÉMENT RELATED :", {
          parent: item.name,
          supplement: related.name,
          price: supplementPrice,
          quantity: supplementQuantity,
          total: supplementTotal,
        });

        continue;
      }

      /*
      ======================================================
      AUTRE RELATED ITEM PAYANT
      ======================================================
      */

      const relatedPrice =
        parsePrice(related.price);

      const relatedQuantity = Math.max(
        1,
        Number(related.quantity ?? 1)
      );

      relatedTotal +=
        relatedPrice * relatedQuantity;
    }

    /*
    ========================================================
    TOTAL PRODUIT
    ========================================================
    */

    const lineTotal =
      (itemPrice + relatedTotal) * quantity;

    console.log("💰 TOTAL LIGNE :", {
      produit: item.name,
      prixProduit: itemPrice,
      prixRelated: relatedTotal,
      quantity,
      total: lineTotal,
    });

    total += lineTotal;
  }

  /*
  ========================================================
  ARRONDI FINAL
  ========================================================
  */

  total =
    Math.round(
      (total + Number.EPSILON) * 100
    ) / 100;

  console.log("================================");
  console.log("💰 TOTAL PANIER :", total);
  console.log("================================");

  return {
    total,
    formatted: `${total.toFixed(2)}€`,
  };
}
