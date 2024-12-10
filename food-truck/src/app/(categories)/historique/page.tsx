"use client";

import Image from 'next/image';
import data from './historique.json';

export interface Historique {
    id: number;
    image: string;
    items: string[];
    user_name: string;
    user_image: string;
    time: string;
    price: string;
}

const Historique = () => {
    const historique: Historique[] = data.historique; // Access the array within the object

    const formatPrice = (price: string) => {
        const numberPrice = parseFloat(price.replace('€', '').replace(',', '.'));
        return numberPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
    };

    const totalPrice = historique.reduce((total, commande) =>
        total + parseFloat(commande.price.replace('€', '').replace(',', '.')), 0);

    return (
        <div className="flex flex-col w-1/2 mt-3">
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
                    <div className="flex flex-row items-center justify-end">
                        <div className="flex">Recette du jour :</div>
                        <div className="flex p-1 rounded-md border-2 bg-white ">{formatPrice(totalPrice.toString())}</div>
                    </div>
                </table>
            </div>
        </div>
    );
};

export default Historique;
