/**
 * Point d'entrée pour la nouvelle structure DB
 * Agrège les données pour fournir le format attendu par l'application
 *
 * Schéma DB:
 * CATEGORIES ───< PRODUITS >── PRODUIT_GARNITURES >── GARNITURES
 *                      |        PRODUIT_TAGS >── TAGS
 *                      |        STOCKS >── MOUVEMENTS_STOCK
 * COMMANDES ───< LIGNE_COMMANDES
 */

import categoriesData from "./categories.json";
import produitsData from "./produits.json";
import garnituresData from "./garnitures.json";
import produitGarnituresData from "./produit_garnitures.json";
import produitTagsData from "./produit_tags.json";
import tagsData from "./tags.json";
import stocksData from "./stocks.json";

export type Categorie = { id: number; name: string };
export type Tag = { id: number; name: string };
export type Garniture = { id: number; name: string; image: string };
export type Produit = {
  id: number;
  name: string;
  image: string;
  price: string;
  categorie_id: number;
};

// Type pour le format legacy (dataProduits)
export type ProduitLegacy = {
  id: number;
  name: string;
  image: string;
  price?: string;
  categorie: string;
  garniture?: { id: number; name: string; image: string }[];
  stock: number;
  stockConseil: number;
  lost: number;
  stockAnnuel: number;
  stockLimite: number;
  categories: string[];
};

/**
 * Retourne les données au format dataProduits (compatibilité)
 * { Mitraillettes: [...], Burgers: [...], ... }
 */
export function getDataProduits(): Record<string, ProduitLegacy[]> {
  const categories = categoriesData as Categorie[];
  const produits = produitsData as Produit[];
  const garnitures = garnituresData as Garniture[];
  const produitGarnitures = produitGarnituresData as { produit_id: number; garniture_id: number }[];
  const produitTags = produitTagsData as { produit_id: number; tag_id: number }[];
  const tags = tagsData as Tag[];
  const stocks = stocksData as { produit_id: number; quantite: number; stockConseil: number; lost: number; stockAnnuel: number; stockLimite: number }[];

  const result: Record<string, ProduitLegacy[]> = {};

  for (const cat of categories) {
    const produitsOfCat = produits
      .filter((p) => p.categorie_id === cat.id)
      .map((p) => {
        const stock = stocks.find((s) => s.produit_id === p.id);
        const garnitureIds = produitGarnitures
          .filter((pg) => pg.produit_id === p.id)
          .map((pg) => garnitures.find((g) => g.id === pg.garniture_id))
          .filter(Boolean) as Garniture[];
        const tagNames = produitTags
          .filter((pt) => pt.produit_id === p.id)
          .map((pt) => tags.find((t) => t.id === pt.tag_id)?.name)
          .filter(Boolean) as string[];

        return {
          id: p.id,
          name: p.name,
          image: p.image || "",
          price: p.price || "",
          categorie: cat.name,
          garniture: garnitureIds.length > 0 ? garnitureIds.map((g) => ({ id: g.id, name: g.name, image: g.image })) : undefined,
          stock: stock?.quantite ?? 20,
          stockConseil: stock?.stockConseil ?? 0,
          lost: stock?.lost ?? 0,
          stockAnnuel: stock?.stockAnnuel ?? 20,
          stockLimite: stock?.stockLimite ?? 0,
          categories: tagNames,
        };
      });
    result[cat.name] = produitsOfCat;
  }

  return result;
}

// Export pour compatibilité avec l'ancien format dataProduits
export const dataProduits = getDataProduits();

// Export des données brutes pour usage avancé
export { default as categories } from "./categories.json";
export { default as tags } from "./tags.json";
export { default as garnitures } from "./garnitures.json";
export { default as produits } from "./produits.json";
export { default as produitGarnitures } from "./produit_garnitures.json";
export { default as produitTags } from "./produit_tags.json";
export { default as stocks } from "./stocks.json";
export { default as mouvementsStock } from "./mouvements_stock.json";
export { default as commandes } from "./commandes.json";
export { default as ligneCommandes } from "./ligne_commandes.json";
