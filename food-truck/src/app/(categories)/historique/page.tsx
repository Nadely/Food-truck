"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from 'date-fns';
import { isAfter, isBefore, isEqual, startOfDay, startOfYear, endOfYear } from 'date-fns';

registerLocale('fr', fr);

export interface Historique {
    id: number;
    image: string;
    items: string[];
    user_name: string;
    user_image: string;
    time: string;
    price: string;
    date: string | Date; // Ajout du champ date
    lieu: string;
    recette: string;
    createdAt: Date;
}

export interface Recettes {
    date: string | Date;
    lieu: string;
    recette: string;
}

const Historique = () => {
    const [historique, setHistorique] = useState<Historique[]>([]);
    const [recettes, setRecettes] = useState<Recettes[]>([]);
    const [startDateRecettes, setStartDateRecettes] = useState<Date | null>(null);
    const [endDateRecettes, setEndDateRecettes] = useState<Date | null>(null);
    const [startDatePertes, setStartDatePertes] = useState<Date | null>(null);
    const [endDatePertes, setEndDatePertes] = useState<Date | null>(null);
    const [filteredRecettes, setFilteredRecettes] = useState<Recettes[]>([]);
    const [filteredPertes, setFilteredPertes] = useState<Recettes[]>([]);
    const [totalRecettes, setTotalRecettes] = useState<string>('0€');

    const formatPrice = (price: string) => {
        const numberPrice = parseFloat(price.replace('€', '').replace(',', '.'));
        return numberPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    };

    const fetchHistorique = async () => {
        try {
            const response = await fetch('/api/historique');
            if (response.ok) {
                const data = await response.json();
                const sortedHistorique = Array.isArray(data.historique) ? data.historique.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
                setHistorique(sortedHistorique);
                setRecettes(Array.isArray(data.recettes) ? data.recettes : []);
            } else {
                console.error('Erreur lors de la récupération de l\'historique.');
                setHistorique([]);
                setRecettes([]);
            }
        } catch (error) {
            console.error('Erreur:', error);
            setHistorique([]);
            setRecettes([]);
        }
    };

    useEffect(() => {
        fetchHistorique();
    }, []);

    useEffect(() => {
        const currentYearStart = startOfYear(new Date());
        const currentYearEnd = endOfYear(new Date());

        const effectiveStartDate = startDateRecettes || currentYearStart;
        const effectiveEndDate = endDateRecettes || currentYearEnd;

        const filtered = recettes.filter((recette) => {
            const recetteDate = startOfDay(new Date(recette.date));
            const normalizedStartDate = startOfDay(effectiveStartDate);
            const normalizedEndDate = startOfDay(effectiveEndDate);

            return (
                (isEqual(recetteDate, normalizedStartDate) || isAfter(recetteDate, normalizedStartDate)) &&
                (isEqual(recetteDate, normalizedEndDate) || isBefore(recetteDate, normalizedEndDate))
            );
        });

        setFilteredRecettes(filtered);

        const total = filtered.reduce((total, recette) => {
            return total + parseFloat(recette.recette.replace('€', '').replace(',', '.'));
        }, 0);

        setTotalRecettes(total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }));
    }, [startDateRecettes, endDateRecettes, recettes]);

    useEffect(() => {
        if (startDatePertes && endDatePertes) {
            const filtered = recettes.filter((recette) => {
                const recetteDate = startOfDay(new Date(recette.date));
                const normalizedStartDate = startOfDay(startDatePertes);
                const normalizedEndDate = startOfDay(endDatePertes);

                return (
                    (isEqual(recetteDate, normalizedStartDate) || isAfter(recetteDate, normalizedStartDate)) &&
                    (isEqual(recetteDate, normalizedEndDate) || isBefore(recetteDate, normalizedEndDate))
                );
            });
            setFilteredPertes(filtered);
        } else {
            setFilteredPertes(recettes);
        }
    }, [startDatePertes, endDatePertes, recettes]);

    if (!Array.isArray(historique)) {
        console.error('historique n\'est pas un tableau:', historique);
        return <div>Erreur de données historiques.</div>;
    }

    const totalPrice = historique.reduce((total, commande) =>
        total + parseFloat(commande.price.replace('€', '').replace(',', '.')), 0);



    return (
        <div className="flex flex-row w-full mt-3 space-x-1">
            <div className="flex flex-col w-1/2">
                <div className="border-black bg-gray-300 rounded-md p-1">
                    <h2 className="font-serif text-center">Historique des commandes</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="border-2 border-black w-full font-serif bg-gray-300">
                        <tbody>
                            {historique.map((commande) => (
                                <tr key={commande.id}>
                                    <td className="p-3">
                                        <div className="flex justify-between items-center bg-blue-200 p-2 rounded-md">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <Image
                                                        src={commande.user_image}
                                                        alt={`Commande ${commande.user_name}`}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-full"
                                                    />
                                                    <span className="text-black font-serif">{commande.user_name}</span>
                                                </div>
                                                <ul className="list-disc list-inside font-serif">
                                                    {commande.items.map((item: string, index: number) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex flex-row items-end gap-2">
                                                    <div className="text-black font-serif text-sm bg-white p-1 rounded-md mb-2">
                                                        {commande.time}
                                                    </div>
                                                    <div className="text-black font-serif text-sm bg-gray-300 p-1 rounded-md mb-2">
                                                        {formatPrice(commande.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end items-center p-2 border-b-2 border-black rounded-md border-2 bg-gray-300 w-full mb-2 font-serif font-bold">
                    Recette du jour :
                    <div className="text-black bg-white rounded-md">
                        {formatPrice(totalPrice.toString())}
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-1/2">
                <div className="flex flex-col h-full">
                    <div className="flex-1 border-2 border-black bg-gray-300 rounded-md p-1">
                        <h2 className="font-serif text-center border-b-2 border-black">Historique des Recettes</h2>
                        <div className="flex flex-row items-center justify-center gap-2 p-2">
                            <label className="block font-serif text-black mr-2">Date de début :</label>
                            <DatePicker
                                selected={startDateRecettes}
                                onChange={(date: Date | null) => setStartDateRecettes(date)}
                                selectsStart
                                startDate={startDateRecettes || undefined}
                                endDate={endDateRecettes || undefined}
                                locale="fr"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Date de début"
                            />
                            <label className="block font-serif text-black mr-2">Date de fin :</label>
                            <DatePicker
                                selected={endDateRecettes}
                                onChange={(date: Date | null) => setEndDateRecettes(date)}
                                selectsEnd
                                startDate={startDateRecettes || undefined}
                                endDate={endDateRecettes || undefined}
                                minDate={startDateRecettes || undefined}
                                locale="fr"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Date de fin"
                                className="w-full"
                            />
                        </div>
                        <table className="border-2 border-black w-full bg-white">
                            <thead className="font-serif font-bold border-b-2 border-black text-center">
                                <tr>
                                    <th>Date</th>
                                    <th>Lieu</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRecettes.length > 0 ? (
                                    filteredRecettes.map((recette, index) => (
                                        <tr key={index}>
                                            <td className="p-2 border-b border-black text-center">
                                                {formatDate(new Date(recette.date), 'dd/MM/yyyy', { locale: fr })}
                                            </td>
                                            <td className="p-2 border-b border-black text-center">{recette.lieu}</td>
                                            <td className="p-2 border-b border-black text-center">
                                                {formatPrice(recette.recette)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center">
                                            Aucune donnée à afficher
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex justify-end items-center p-2 border-b-2 border-black rounded-md border-2 bg-gray-300 w-full mb-2 font-serif font-bold">
                            Recette totale pour la période :
                            <div className="text-black bg-white rounded-md">
                                {totalRecettes}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 border-2 border-black bg-gray-300 rounded-md p-1 mt-2">
                        <h2 className="font-serif text-center border-b-2 border-black">Historique des Pertes</h2>
                        <div className="flex flex-row items-center justify-center gap-2 p-2">
                            <label className="block font-serif text-black mr-2">Date de début :</label>
                            <DatePicker
                                selected={startDatePertes}
                                onChange={(date: Date | null) => setStartDatePertes(date)}
                                selectsStart
                                startDate={startDatePertes || undefined}
                                endDate={endDatePertes || undefined}
                                locale="fr"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Date de début"
                            />
                            <label className="block font-serif text-black mr-2">Date de fin :</label>
                            <DatePicker
                                selected={endDatePertes}
                                onChange={(date: Date | null) => setEndDatePertes(date)}
                                selectsEnd
                                startDate={startDatePertes || undefined}
                                endDate={endDatePertes || undefined}
                                minDate={startDatePertes || undefined}
                                locale="fr"
                                dateFormat="dd/MM/yyyy"
                                isClearable
                                placeholderText="Date de fin"
                                className="w-full"
                            />
                        </div>
                        {/* Ajoutez ici le contenu pour l'historique des pertes */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Historique;
