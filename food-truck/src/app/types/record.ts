export interface Product {
  id: number;
  name: string;
  categories: string[];
  stock: number;
  stockConseil: number;
  lost: number;
  stockAnnuel: number;
  stockLimite: number;
}

export interface LossRecord {
  date: string;
  items: {
    categories: string[];
    produit: string;
    quantite: number;
  }[];
}
