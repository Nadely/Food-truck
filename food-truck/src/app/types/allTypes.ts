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

export interface dataProduct {
  id: number;
  name: string;
  price: number | string;
  image: string;
  categorie: string;
  garniture: string[];
}

export interface LossRecord {
  date: string | Date;
  items: {
    categories: string[];
    produit: string;
    quantite: number;
  }[];
}

export interface Historique {
  id: number;
  image: string;
  items: string[];
  categorie: string[];
  user_name: string;
  user_image: string;
  user_phone: string;
  time: string;
  price: string;
  date: string | Date;
  lieu: string;
  recette: string;
  createdAt: Date;
}

export interface Recettes {
  date: string | Date;
  lieu: string;
  recette: string;
}

export interface Commande {
	id: number;
    image: string;
    items: string[];
    categorie: string[];
    user_name: string;
    user_image: string;
    user_phone: string;
    time: string;
    price: string;
    date: string | Date;
    lieu: string;
    createdAt: Date;
}
