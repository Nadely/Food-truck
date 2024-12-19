"use client"

import { useState } from "react";
import Image from "next/image";

const Supplements = () => {
	const [selected, setSelected] = useState({
		cheddar: false,
		raclette: false,
		reblochon: false,
		chevre: false,
		poitrine: false,
		galettePommeTerre: false,
		galetteFromage: false,
		maroille: false,
		oeuf: false,
	});

	const toggleSelection = (item: keyof typeof selected) => {
		setSelected(prevState => ({
			...prevState,
			[item]: !prevState[item]
		}));
	};

    return (
			<div className="flex flex-col items-center justify-center font-bold font-serif mt-10 text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Suppléments*</h1>
					<div className="flex flex-col items-center justify-center mt-10">
							<div className="flex flex-row items-center justify-center mb-10 gap-8">
								<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.cheddar ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('cheddar')}>
									<Image src="/cheddar.jpg" alt="Cheddar" width={100} height={100} />
									<p className="text-sm mt-5">Cheddar</p>
								</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.raclette ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('raclette')}>
									<Image src="/raclette.jpg" alt="Raclette" width={100} height={100} />
									<p className="text-sm mt-5">Raclette</p>
							</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.reblochon ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('reblochon')}>
									<Image src="/reblochon.jpg" alt="Reblochon" width={100} height={100} />
									<p className="text-sm mt-5">Reblochon</p>
							</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.chevre ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('chevre')}>
									<Image src="/chevre.jpg" alt="Chevre" width={100} height={100} />
									<p className="text-sm mt-5">Chèvre</p>
							</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.poitrine ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('poitrine')}>
									<Image src="/poitrine.jpg" alt="Poitrine fumée" width={100} height={100} />
									<p className="text-sm mt-5">Poitrine fumée</p>
								</button>
							</div>
							<div className="flex flex-row items-center justify-center gap-8">
								<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.galettePommeTerre ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('galettePommeTerre')}>
									<Image src="/galette-de-pomme-de-terre.jpg" alt="Galette de pomme de terre" width={100} height={100} />
									<p className="text-sm mt-5">Galette de pomme de terre</p>
							</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.galetteFromage ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('galetteFromage')}>
									<Image src="/galette-de-fromage.jpg" alt="Galette de fromage" width={100} height={100} />
									<p className="text-sm mt-5">Galette de fromage</p>
							</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.maroille ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('maroille')}>
									<Image src="/maroille.jpg" alt="Maroille" width={100} height={100} />
									<p className="text-sm mt-5">Maroille</p>
								</button>
							<button className={`border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center ${selected.oeuf ? 'bg-green-200' : ''}`} style={{ width: '200px', height: '200px' }} onClick={() => toggleSelection('oeuf')}>
									<Image src="/oeuf.jpg" alt="Oeuf" width={100} height={100} />
									<p className="text-sm mt-5">Oeuf</p>
							</button>
							</div>
					</div>
					<div className="flex flex-col items-center justify-center mt-10">
						<button className="button-blue text-lg w-40">
							Valider
						</button>
					</div>
					<p className="text-sm mt-5">*Tous les suppléments sont à 1€</p>
				</div>
    );
}

export default Supplements;
