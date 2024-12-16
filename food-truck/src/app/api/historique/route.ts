import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const nouvelleCommande = await request.json();
        const preparationPath = path.join(process.cwd(), 'src/app/(categories)/commandes/preparation.json');
        const historiquePath = path.join(process.cwd(), 'src/app/(categories)/historique/historique.json');

        if (!fs.existsSync(historiquePath)) {
            fs.writeFileSync(historiquePath, JSON.stringify({ historique: [], recettes: [], pertes: [] }, null, 4), 'utf-8');
        }

        const preparationData = fs.readFileSync(preparationPath, 'utf-8');
        const commandes = JSON.parse(preparationData);

        // Trouver et supprimer la commande de 'pretes'
        const preteIndex = commandes.pretes.findIndex((c: any) => c.id === nouvelleCommande.id);
        if (preteIndex !== -1) {
            const [commande] = commandes.pretes.splice(preteIndex, 1);

            const historiqueData = fs.readFileSync(historiquePath, 'utf-8');
            const historique = JSON.parse(historiqueData);

            // Ajouter la nouvelle commande au tableau des historiques
            historique.historique.push(nouvelleCommande);

            // Calculer le total des recettes pour la date de la nouvelle commande
            const date = nouvelleCommande.date;
            const lieu = nouvelleCommande.lieu;
            const price = parseFloat(nouvelleCommande.price.replace('€', '').replace(',', '.'));

            const existingRecette = historique.recettes.find((recette: any) => recette.date === date && recette.lieu === lieu);
            if (existingRecette) {
                existingRecette.recette = (parseFloat(existingRecette.recette.replace('€', '').replace(',', '.')) + price).toFixed(2) + '€';
            } else {
                historique.recettes.push({ date, lieu, recette: price.toFixed(2) + '€' });
            }

            fs.writeFileSync(historiquePath, JSON.stringify(historique, null, 4), 'utf-8');
        }

        return NextResponse.json({ message: 'Commande ajoutée avec succès.' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors de l\'ajout de la commande.' }, { status: 500 });
    }
}

export async function GET(request: Request) {

    try {
        const historiquePath = path.join(process.cwd(), 'src/app/(categories)/historique/historique.json');

        if (!fs.existsSync(historiquePath)) {
            fs.writeFileSync(historiquePath, JSON.stringify({ historique: [], recettes: [] }, null, 4), 'utf-8');
        }

        const data = fs.readFileSync(historiquePath, 'utf-8');
        let historique = JSON.parse(data);

        // Vérifier que 'historique.historique' est bien un tableau
        if (!Array.isArray(historique.historique)) {
            console.warn('La clé "historique" n\'est pas un tableau. Réinitialisation avec un tableau vide.');
            historique.historique = [];
        }

        // Vérifier que 'historique.recettes' est bien un tableau
        if (!Array.isArray(historique.recettes)) {
            console.warn('La clé "recettes" n\'est pas un tableau. Réinitialisation avec un tableau vide.');
            historique.recettes = [];
        }

        fs.writeFileSync(historiquePath, JSON.stringify(historique, null, 4), 'utf-8');

        return NextResponse.json({ historique: historique.historique, recettes: historique.recettes }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors de la récupération de l\'historique.' }, { status: 500 });
    }
}

export async function moveToHistorique(request: Request) {
    try {
        const { commandeId } = await request.json();
        const preparationPath = path.join(process.cwd(), 'src/app/(categories)/commandes/preparation.json');
        const historiquePath = path.join(process.cwd(), 'src/app/(categories)/historique/historique.json');

        const preparationData = fs.readFileSync(preparationPath, 'utf-8');
        const commandes = JSON.parse(preparationData);

        // Trouver et supprimer la commande de 'pretes'
        const preteIndex = commandes.pretes.findIndex((c: any) => c.id === commandeId);
        if (preteIndex !== -1) {
            const [commande] = commandes.pretes.splice(preteIndex, 1);

            // Ajouter la commande à l'historique
            const historiqueData = fs.readFileSync(historiquePath, 'utf-8');
            const historique = JSON.parse(historiqueData);
            historique.historique.push(commande);

            // Écrire les modifications dans les fichiers JSON
            fs.writeFileSync(preparationPath, JSON.stringify(commandes, null, 4), 'utf-8');
            fs.writeFileSync(historiquePath, JSON.stringify(historique, null, 4), 'utf-8');

            return NextResponse.json({ message: 'Commande servie et déplacée vers historique avec succès.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Commande non trouvée dans pretes.' }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors du déplacement de la commande vers historique.' }, { status: 500 });
    }
}
