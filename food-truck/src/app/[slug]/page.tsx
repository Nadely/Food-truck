"use client";

import { usePathname } from 'next/navigation';

const SlugPage = () => {
    const pathname = usePathname();
    const slug = pathname.split('/').pop();

    return (
        <div>
            {slug === 'commande' && (
                <div>
                    <h1>Tableau pour Commande</h1>
                    {/* Ajoutez votre tableau ici */}
                </div>
            )}
            {slug === 'evenement' && (
                <div>
                    <h1>Boutons pour Evènement</h1>
                    {/* Ajoutez vos boutons ici */}
                </div>
            )}
            {slug === 'stocks' && (
                <div>
                    <h1>Liste avec filtre pour Stocks</h1>
                    {/* Ajoutez votre liste avec filtre ici */}
                </div>
            )}
            {slug === 'historique' && (
                <div>
                    <h1>Affichage de recette pour Historique</h1>
                    {/* Ajoutez votre affichage de recette ici */}
                </div>
            )}
        </div>
    );
};

export default SlugPage;
