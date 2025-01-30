"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const HomePage = () => {
    const [selectedLieu, setSelectedLieu] = useState<string | null>(null);

    // Charger l'état depuis localStorage au montage du composant
    useEffect(() => {
        const savingLieu = localStorage.getItem("selectedLieu");
        if (savingLieu) {
            setSelectedLieu(savingLieu);
        }
    }, []);

    // Mettre à jour localStorage lorsqu'un lieu est sélectionné
    const handleLieuClick = async (lieu: string) => {
        setSelectedLieu(lieu);
        localStorage.setItem("selectedLieu", lieu);
        console.log(`Lieu sélectionné: `, lieu);

        // Envoyer le lieu sélectionné à l'API
        // try {
        //     console.log(lieu);
        //     const response = await fetch('/api/commandes', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ lieu }),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Erreur lors de l\'envoi du lieu');
        //     }

    //         const contentType = response.headers.get("content-type");
    //         if (contentType && contentType.includes("application/json")) {
    //             const data = await response.json();
    //             console.log('Réponse de l\'API:', data);
    //         } else {
    //             throw new Error('Réponse non JSON reçue');
    //         }

    //         console.log('Lieu envoyé avec succès');
    //     } catch (error) {
    //         console.error('Erreur:', error);
    //     }
    };

    // Gérer le bouton "Fermer"
    const handleClose = () => {
        setSelectedLieu(null);
        localStorage.removeItem("selectedLieu");
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-20">
                <h6 className="text-center text-2xl font-bold font-serif text-black">
                    Bienvenue sur ton tableau de bord
                </h6>
                {!selectedLieu ? (
                    <p className="text-center text-sm font-bold font-serif text-black mt-5">
                        Choisis une ville pour ouvrir les commandes en ce lieu.
                    </p>
                ) : (
                    <p className="text-center text-sm font-bold font-serif text-black mt-5">
                        Lieu sélectionné : {selectedLieu}
                    </p>
                )}
            </div>

            {!selectedLieu ? (
                // Afficher les choix des lieux si aucun lieu n'est sélectionné
                <div className="flex flex-col 2xl:flex-row justify-center items-center mt-20">
                    <div className="flex flex-row items-center justify-center mb-5 mr-5 gap-8">
                        <button
                            className="bg-blue-500 border-2 border-black text-black font-bold font-serif h-48 w-48 rounded-md w-1/2"
                            onClick={() => handleLieuClick("Neau")}
                        >
                            <Link href="/commandes">Ouvert à Neau</Link>
                        </button>
                        <button
                            className="bg-yellow-500 border-2 border-black text-black font-bold font-serif h-48 w-48 rounded-md w-1/2"
                            onClick={() => handleLieuClick("Montsûrs")}
                        >
                            <Link href="/commandes">Ouvert à Montsûrs</Link>
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-center mb-5 mr-5 gap-8">
                        <button
                            className="bg-green-500 border-2 border-black text-black font-bold font-serif h-48 w-48 rounded-md w-1/2"
                            onClick={() => handleLieuClick("St-Suzanne")}
                        >
                            <Link href="/commandes">Ouvert à St-Suzanne</Link>
                        </button>
                        <button
                            className="bg-red-500 border-2 border-black text-black font-bold font-serif h-48 w-48 rounded-md w-1/2"
                            onClick={() => handleLieuClick("Châtre-la-forêt")}
                        >
                            <Link href="/commandes">Ouvert à Châtre-la-forêt</Link>
                        </button>
                    </div>
                </div>
            ) : (
                // Afficher le bouton "Fermer" si un lieu est sélectionné
                <div className="flex flex-col items-center justify-center mt-20">
                    <button
                        className="bg-gray-200 border-2 border-black text-black font-bold font-serif h-16 w-48 h-48 rounded-md"
                        onClick={handleClose}
                    >
                        Fermer {selectedLieu}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
