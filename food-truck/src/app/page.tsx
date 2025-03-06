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
    };

    // Gérer le bouton "Fermer"
    const handleClose = () => {
        setSelectedLieu(null);
        localStorage.removeItem("selectedLieu");
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-20">
                <h6 className="text-center text-4xl text-white style-pen text-black">
                    Bienvenue sur ton tableau de bord
                </h6>
                {!selectedLieu ? (
                    <p className="text-center text-xl style-pen text-white text-black mt-5">
                        Choisis une ville pour ouvrir les commandes en ce lieu.
                    </p>
                ) : (
                    <p className="text-center text-white text-lg style-pen text-black mt-5">
                        Lieu selectionne : {selectedLieu}
                    </p>
                )}
            </div>

            {!selectedLieu ? (
                // Afficher les choix des lieux si aucun lieu n'est sélectionné
                <div className="flex flex-col 2xl:flex-row justify-center items-center mt-20">
                    <div className="flex flex-row items-center justify-center mb-5 mr-5 gap-8">
                        <button
                            className="relative shadow-light flex flex-col items-center justify-center text-xl text-white gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:text-black hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                            style={{ width: "200px", height: "200px" }}
                            onClick={() => handleLieuClick("Neau")}
                        >
                            <Link href="/commandes">Ouverture a Neau</Link>
                        </button>
                        <button
                            className="relative shadow-light flex flex-col items-center justify-center text-xl text-white gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:text-black hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                            style={{ width: "200px", height: "200px" }}
                            onClick={() => handleLieuClick("Montsûrs")}
                        >
                            <Link href="/commandes">Ouverture a Montsurs</Link>
                        </button>
                    </div>
                    <div className="flex flex-row items-center justify-center mb-5 mr-5 gap-8">
                        <button
                            className="relative shadow-light flex flex-col items-center justify-center text-xl text-white gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:text-black hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                            style={{ width: "200px", height: "200px" }}
                            onClick={() => handleLieuClick("St-Suzanne")}
                        >
                            <Link href="/commandes">Ouverture a St-Suzanne</Link>
                        </button>
                        <button
                            className="relative shadow-light flex flex-col items-center justify-center text-xl text-white gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:text-black hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                            style={{ width: "200px", height: "200px" }}
                            onClick={() => handleLieuClick("Châtre-la-forêt")}
                        >
                            <Link href="/commandes">Ouverture a Chatre-la-foret</Link>
                        </button>
                    </div>
                </div>
            ) : (
                // Afficher le bouton "Fermer" si un lieu est sélectionné
                <div className="flex flex-col items-center justify-center mt-20">
                    <button
                        className="relative shadow-light flex flex-col items-center justify-center text-xl text-white gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:text-black hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                        style={{ width: "200px", height: "200px" }}
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
