"use client"

import Image from 'next/image';
import data from '../../../data/preparation.json'; // Assurez-vous que le chemin est correct
import Link from 'next/link';
import { useState } from 'react';
import { Commande } from '../../types/allTypes';


const listCommandes : Commande[] = data.preparations.map(commande => ({
	...commande,
	createdAt: new Date(commande.createdAt)
}));

const Commandes = () => {
	const [preparations, setPreparations] = useState<Commande[]>([...listCommandes]);
	const [pretes, setPretes] = useState<Commande[]>([]);
	const [historique, setHistorique] = useState<Commande[]>([]);

	const loadLocalStorage = () => {
		const storageValue = localStorage.getItem('selectedLieu');
		return storageValue || "Maison";
	};

	const loadLieu = loadLocalStorage();

	const handlePrête = async (commandeId: number) => {
		const commande = preparations.find(c => c.id === commandeId);
		console.log(commande);
		console.log(commande?.lieu);
		console.log(loadLieu);


		if (commande) {
			commande.lieu = loadLieu;
			try {
				const response = await fetch('/api/commandes', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ commandeId }),
				});

				if (response.ok) {
					setPreparations(preparations.filter(c => c.id !== commandeId));
					setPretes([...pretes, commande]);
				} else {
					console.error('Erreur lors du déplacement de la commande.');
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		}
	};

	const handleServie = async (commandeId: number) => {
		const commande = pretes.find(c => c.id === commandeId);
		if (commande) {
			commande.lieu = loadLieu;
			try {
				const response = await fetch('/api/historique', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(commande),
				});

				if (response.ok) {
					setPretes(pretes.filter(c => c.id !== commandeId));
					setHistorique([...historique, commande]);
				} else {
					console.error('Erreur lors de l\'ajout de la commande à l\'historique.');
				}
			} catch (error) {
				console.error('Erreur:', error);
			}
		}
	};

	const formatPrice = (price: string | null | undefined) => {
    if (!price || typeof price !== "string") {
        console.error("Prix invalide reçu:", price);
        return "Prix inconnu";
    }

    const cleanedPrice = price.replace("€", "").replace(",", ".").trim();
    const numberPrice = parseFloat(cleanedPrice);

    if (isNaN(numberPrice)) {
        console.error("Prix mal formaté:", price, "-> après nettoyage:", cleanedPrice);
        return "Prix inconnu";
    }

    return numberPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
};


	return (
		<div className="flex flex-col mt-2">
			<div className="flex flex-row justify-end items-center mr-20 gap-4">
				<Link href="/nouvelle_commande" className="button-yellow style-pen">
					Nouvelle Commande
				</Link>
				<Link href="/historique" className="button-blue style-pen">
					Historique
				</Link>
			</div>
			<div className="flex flex-row mt-2 space-x-1">
				{/* Commandes en préparation */}
				<div className="flex flex-col w-1/2">
					<div className="border-black bg-gray-200 rounded-md p-1">
						<h2 className="style-pen text-center">Commandes en preparation</h2>
					</div>
					<div className="max-h-[600px] overflow-y-auto">
						<table className="border-2 border-black w-full style-pen bg-gray-200">
							<tbody>
								{preparations.map((commande) => (
									<tr key={commande.id}>
										<td className="p-3">
											<div className="flex justify-between items-center bg-blue-200 p-2 rounded-md">
												<div className="flex items-center space-x-4">
													<div className="flex flex-col items-center">
														<Image
															src={commande.user_image}
															alt={`Commande ${commande.user_image}`}
															width={50}
															height={50}
															className="rounded-full"
														/>
														<span className="text-black style-pen text-sm">{commande.user_name}</span>
														<span className="text-black style-pen text-sm">{commande.user_phone}</span>
													</div>
													<ul className="list-none list-inside style-pen">
														{commande.items.map((item, index) => (
															<li key={index}>
																<div className="flex items-center">
																	{item.quantity && item.quantity !== 1 ? `${item.quantity} x ` : ''}
																	<span style={{ marginRight: '5px' }}>
																		{item.name && item.name.length > 0 && !item.relatedItems?.some(rel => rel.name === item.name) ? item.name : ''}
																	</span>
																</div>
																{item.relatedItems && item.relatedItems.length > 0 && (
																	<ul className="list-disc list-inside ml-5">
																		{item.relatedItems.map((related, idx) => (
																			<li key={idx}>{typeof related === 'string' ? related : related.name}</li>
																		))}
																	</ul>
																)}
															</li>
														))}
													</ul>
												</div>
												<div className="flex flex-col items-end">
													<div className="flex flex-row items-end gap-2">
														<div className="text-black style-pen text-sm bg-white p-1 rounded-md mb-2">
															{commande.time}
														</div>
														<div className="text-black style-pen text-sm bg-gray-300 p-1 rounded-md mb-2">
															{formatPrice(commande.price)}
														</div>
													</div>
													<button
														onClick={() => handlePrête(commande.id)}
														className="button-green style-pen"
													>
														Prete
													</button>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Commandes prêtes */}
				<div className="flex flex-col w-1/2">
					<div className="border-black bg-gray-100 rounded-md p-1">
						<h2 className="style-pen text-center">Commandes pretes</h2>
					</div>
					<div className="max-h-[600px] overflow-y-auto">
						<table className="border-2 border-black rounded-md w-full style-pen bg-gray-100">
							<tbody>
								{pretes.map((commande) => (
									<tr key={commande.id}>
										<td className="p-3">
											<div className="flex justify-between items-center bg-purple-200 p-2 rounded-md">
												<div className="flex items-center space-x-4">
													<div className="flex flex-col items-center">
														<Image
															src={commande.user_image}
															alt={`Commande ${commande.user_image}`}
															width={50}
															height={50}
															className="rounded-full"
														/>
														<span className="text-black style-pen text-sm">{commande.user_name}</span>
														<span className="text-black style-pen text-sm">{commande.user_phone}</span>
													</div>
													<ul className="list-none list-inside style-pen">
														{commande.items.map((item, index) => (
															<li key={index}>
																<div className="flex items-center">
																	{item.quantity && item.quantity !== 1 ? `${item.quantity} x ` : ''}
																	<span style={{ marginRight: '5px' }}>
																		{item.name && item.name.length > 0 && !item.relatedItems?.some(rel => rel.name === item.name) ? item.name : ''}
																	</span>
																</div>
																{item.relatedItems && item.relatedItems.length > 0 && (
																	<ul className="list-disc list-inside ml-5">
																		{item.relatedItems.map((related, idx) => (
																			<li key={idx}>{typeof related === 'string' ? related : related.name}</li>
																		))}
																	</ul>
																)}
															</li>
														))}
													</ul>
												</div>
												<div className="flex flex-col items-end">
													<div className="flex flex-row items-end gap-2">
														<div className="text-black style-pen text-sm bg-white p-1 rounded-md mb-2">
															{commande.time}
														</div>
														<div className="text-black style-pen text-sm bg-gray-300 p-1 rounded-md mb-2">
															{formatPrice(commande.price)}
														</div>
													</div>
													<button
														onClick={() => handleServie(commande.id)}
														className="button-red style-pen"
													>
														Servie
													</button>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Commandes;
