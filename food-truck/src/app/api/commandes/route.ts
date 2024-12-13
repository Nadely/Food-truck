import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { commandeId } = await request.json();
        const preparationPath = path.join(process.cwd(), 'src/app/(categories)/commandes/preparation.json');
        const historiquePath = path.join(process.cwd(), 'src/app/(categories)/historique/historique.json');

        const preparationData = fs.readFileSync(preparationPath, 'utf-8');
        const commandes = JSON.parse(preparationData);

        const commandeIndex = commandes.preparations.findIndex((c: any) => c.id === commandeId);
        if (commandeIndex !== -1) {
            const [commande] = commandes.preparations.splice(commandeIndex, 1);
            commandes.pretes.push(commande);


            fs.writeFileSync(preparationPath, JSON.stringify(commandes, null, 4), 'utf-8');

            return NextResponse.json({ message: 'Commande déplacée avec succès.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Commande non trouvée.' }, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Erreur lors du déplacement de la commande.' }, { status: 500 });
    }
}
