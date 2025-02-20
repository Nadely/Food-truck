import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Commande, Historique } from "@/app/types/allTypes";

// Fonction utilitaire pour nettoyer l'historique
function nettoyerHistorique(historiquePath: string) {
  const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;

   if (!fs.existsSync(historiquePath)) {
    return;
   }

   const data = fs.readFileSync(historiquePath, 'utf-8');
   const historique = JSON.parse(data);

   const now = new Date().getTime();

   // Nettoyer uniquement les commandes historiques (moins de 12 heures)
   historique.historique = historique.historique.filter((entry: any) => {
    const entryTime = new Date(entry.createdAt).getTime();
    return now - entryTime <= TWELVE_HOURS_IN_MS;
   });

   // Écrire les données nettoyées
   fs.writeFileSync(historiquePath, JSON.stringify(historique, null, 4), 'utf-8');
  }


export async function POST(request: Request) {
  try {
    const nouvelleCommande = await request.json();
    const preparationPath = path.join(
      process.cwd(),
      "src/data/preparation.json"
    );
    const historiquePath = path.join(process.cwd(), "src/data/historique.json");

    if (!fs.existsSync(historiquePath)) {
      fs.writeFileSync(
        historiquePath,
        JSON.stringify({ historique: [], recettes: [], pertes: [] }, null, 4),
        "utf-8"
      );
    }

    const preparationData = fs.readFileSync(preparationPath, "utf-8");
    const commandes = JSON.parse(preparationData);

    // Trouver et supprimer la commande de 'pretes'
    const preteIndex = commandes.pretes.findIndex(
      (c: Commande) => c.id === nouvelleCommande.id
    );
    if (preteIndex !== -1) {
      // const [commande] = commandes.pretes.splice(preteIndex, 1);

      const historiqueData = fs.readFileSync(historiquePath, "utf-8");
      const historique = JSON.parse(historiqueData);

      // Ajouter la nouvelle commande au tableau des historiques
      historique.historique.push(nouvelleCommande);

      // Fonction pour extraire la date sans l'heure
      const extractDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toISOString().split("T")[0]; // Formater en yyyy-mm-dd
      };

      // Puis dans la logique de gestion des recettes :

      const date = extractDate(nouvelleCommande.date); // Extraire uniquement la date sans l'heure
      const lieu = nouvelleCommande.lieu;
      const price = parseFloat(
        nouvelleCommande.price.replace("€", "").replace(",", ".")
      );

      const existingRecette = historique.recettes.find(
        (recette: Historique) => extractDate(recette.date) === date && recette.lieu === lieu
      );

      if (existingRecette) {
        // Ajouter à la recette existante
        existingRecette.recette =
          (
            parseFloat(
              existingRecette.recette.replace("€", "").replace(",", ".")
            ) + price
          ).toFixed(2) + "€";
      } else {
        // Créer une nouvelle entrée de recette pour cette date et ce lieu
        historique.recettes.push({
          date,
          lieu,
          recette: price.toFixed(2) + "€",
        });
      }


      fs.writeFileSync(
        historiquePath,
        JSON.stringify(historique, null, 4),
        "utf-8"
      );
    }

    return NextResponse.json(
      { message: "Commande ajoutée avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de la commande." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const historiquePath = path.join(process.cwd(), "src/data/historique.json");

    if (!fs.existsSync(historiquePath)) {
      fs.writeFileSync(
        historiquePath,
        JSON.stringify({ historique: [], recettes: [] }, null, 4),
        "utf-8"
      );
    }

    // Nettoyer les anciennes données de l'historique
    nettoyerHistorique(historiquePath);

    const data = fs.readFileSync(historiquePath, "utf-8");
    const historique = JSON.parse(data);

    // Vérification et réécriture des données
    if (!Array.isArray(historique.historique)) {
      historique.historique = [];
    }
    if (!Array.isArray(historique.recettes)) {
      historique.recettes = [];
    }

    fs.writeFileSync(
      historiquePath,
      JSON.stringify(historique, null, 4),
      "utf-8"
    );

    return NextResponse.json(
      { historique: historique.historique, recettes: historique.recettes },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de l'historique." },
      { status: 500 }
    );
  }
}

export async function moveToHistorique(request: Request) {
  try {
    const { commandeId } = await request.json();
    const preparationPath = path.join(
      process.cwd(),
      "src/data/preparation.json"
    );
    const historiquePath = path.join(process.cwd(), "src/data/historique.json");

    const preparationData = fs.readFileSync(preparationPath, "utf-8");
    const commandes = JSON.parse(preparationData);

    // Trouver et supprimer la commande de 'pretes'
    const preteIndex = commandes.pretes.findIndex(
      (c: Commande) => c.id === commandeId
    );
    if (preteIndex !== -1) {
      const [commande] = commandes.pretes.splice(preteIndex, 1);

      // Ajouter la commande à l'historique
      const historiqueData = fs.readFileSync(historiquePath, "utf-8");
      const historique = JSON.parse(historiqueData);
      historique.historique.push(commande);

      // Écrire les modifications dans les fichiers JSON
      fs.writeFileSync(
        preparationPath,
        JSON.stringify(commandes, null, 4),
        "utf-8"
      );
      fs.writeFileSync(
        historiquePath,
        JSON.stringify(historique, null, 4),
        "utf-8"
      );

      return NextResponse.json(
        { message: "Commande servie et déplacée vers historique avec succès." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Commande non trouvée dans pretes." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erreur lors du déplacement de la commande vers historique." },
      { status: 500 }
    );
  }
}
