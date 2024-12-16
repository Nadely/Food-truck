export interface LossRecord {
  date: string;
  items: {
    categories: string;
    produit: string;
    quantite: number;
  }[];
}

export interface StockItem {
  id: number;
  produit: string;
  categorie: string;
  stock: number;
  conseille: number;
  perdue: number;
  stockAnnuel: number;
}
