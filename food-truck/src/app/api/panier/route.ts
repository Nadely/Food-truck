import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const cart = await request.json();
    const panierFilePath = path.join(process.cwd(), 'src/data/panier.json');
    const preparationFilePath = path.join(process.cwd(), 'src/data/preparation.json');

    // Formatage du panier reçu
    const formattedCart = {
      id: cart.id || Date.now(),
      image: cart.image || "/images/default.jpg",
      items: cart.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: (item.price * item.quantity).toFixed(2),
        relatedItems: item.relatedItems ? item.relatedItems.map(relatedItem => ({
          name: relatedItem.name,
          price: relatedItem.price,
          quantity: relatedItem.quantity,
          total: (relatedItem.price * relatedItem.quantity).toFixed(2),
        })) : [],
      })),
      user_name: cart.user_name || "Inconnu",
      user_image: cart.user_image || "/avatar.jpg",
      time: cart.time || new Date().toLocaleTimeString(),
      date: cart.date || new Date().toISOString(),
      lieu: cart.lieu || "Non spécifié",
      price: cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2) + "€",
      createdAt: cart.createdAt || new Date().toISOString(),
    };

    // Vérification de l'existence du fichier panier
    let existingCartData = { panier: [] };
    if (fs.existsSync(panierFilePath)) {
      const existingData = fs.readFileSync(panierFilePath, 'utf-8');
      existingCartData = JSON.parse(existingData);
    }

    // Ajout du panier formaté aux données existantes
    existingCartData.panier.push(formattedCart);

    // Sauvegarde des données dans panier.json
    fs.writeFileSync(panierFilePath, JSON.stringify(existingCartData, null, 2));

    return NextResponse.json({ message: 'Panier sauvegardé avec succès.', cart: formattedCart }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors de la sauvegarde du panier.', error }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const panierFilePath = path.join(process.cwd(), 'src/data/panier.json');
    const preparationFilePath = path.join(process.cwd(), 'src/data/preparation.json');

    // Lire les données du panier
    const panierData = fs.readFileSync(panierFilePath, 'utf-8');
    const panier = JSON.parse(panierData);

    // Lire les données de préparation
    const preparationData = fs.readFileSync(preparationFilePath, 'utf-8');
    const preparation = JSON.parse(preparationData) || { preparation: [] };

    // Ajouter les paniers à la préparation
    preparation.preparation.push(...panier.panier);

    // Sauvegarder dans préparation.json
    fs.writeFileSync(preparationFilePath, JSON.stringify(preparation, null, 2));

    return NextResponse.json({ message: 'Panier transféré vers préparation.json' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erreur lors du transfert dans préparation.json.', error }, { status: 500 });
  }
}
