export interface Product {
  id: number;
  name: string;
  price: number;
  categories: string[];
  image: string;
  stock: number;
  stockConseil: number;
  lost: number;
  stockAnnuel: number;
}

export interface LossRecord {
  date: string;
  items: {
    categories: string[];
    produit: string;
    quantite: number;
  }[];
}
