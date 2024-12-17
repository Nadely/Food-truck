"use client"

import { useState } from "react";
import Image from "next/image";

const Supplements = () => {
	const [cheddarQuantity, setCheddarQuantity] = useState(0);
	const [racletteQuantity, setRacletteQuantity] = useState(0);
	const [reblochonQuantity, setReblochonQuantity] = useState(0);
	const [chevreQuantity, setChevreQuantity] = useState(0);
	const [poitrineQuantity, setPoitrineQuantity] = useState(0);
	const [galettePommeTerreQuantity, setGalettePommeTerreQuantity] = useState(0);
	const [galetteFromageQuantity, setGaletteFromageQuantity] = useState(0);
	const [maroilleQuantity, setMaroilleQuantity] = useState(0);
	const [oeufQuantity, setOeufQuantity] = useState(0);


	const incrementCheddar = () => setCheddarQuantity(cheddarQuantity + 1);
	const decrementCheddar = () => setCheddarQuantity(cheddarQuantity > 0 ? cheddarQuantity - 1 : 0);

	const incrementRaclette = () => setRacletteQuantity(racletteQuantity + 1);
	const decrementRaclette = () => setRacletteQuantity(racletteQuantity > 0 ? racletteQuantity - 1 : 0);

	const incrementReblochon = () => setReblochonQuantity(reblochonQuantity + 1);
	const decrementReblochon = () => setReblochonQuantity(reblochonQuantity > 0 ? reblochonQuantity - 1 : 0);

	const incrementChevre = () => setChevreQuantity(chevreQuantity + 1);
	const decrementChevre = () => setChevreQuantity(chevreQuantity > 0 ? chevreQuantity - 1 : 0);

	const incrementPoitrine = () => setPoitrineQuantity(poitrineQuantity + 1);
	const decrementPoitrine = () => setPoitrineQuantity(poitrineQuantity > 0 ? poitrineQuantity - 1 : 0);

	const incrementGalettePommeTerre = () => setGalettePommeTerreQuantity(galettePommeTerreQuantity + 1);
	const decrementGalettePommeTerre = () => setGalettePommeTerreQuantity(galettePommeTerreQuantity > 0 ? galettePommeTerreQuantity - 1 : 0);

	const incrementGaletteFromage = () => setGaletteFromageQuantity(galetteFromageQuantity + 1);
	const decrementGaletteFromage = () => setGaletteFromageQuantity(galetteFromageQuantity > 0 ? galetteFromageQuantity - 1 : 0);

	const incrementMaroille = () => setMaroilleQuantity(maroilleQuantity + 1);
	const decrementMaroille = () => setMaroilleQuantity(maroilleQuantity > 0 ? maroilleQuantity - 1 : 0);

	const incrementOeuf = () => setOeufQuantity(oeufQuantity + 1);
	const decrementOeuf = () => setOeufQuantity(oeufQuantity > 0 ? oeufQuantity - 1 : 0);

    return (
			<div className="flex flex-col items-center justify-center font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Suppléments</h1>
					<div className="flex flex-col items-center justify-center mt-10 gap-4">
							<div className="flex flex-row items-center justify-center gap-4">
								<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/cheddar.png" alt="Cheddar" width={55} height={55} />
									<p className="text-xs mt-1">Cheddar</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementCheddar} className="text-sm">-</button>
											<span className="text-sm">{cheddarQuantity}</span>
											<button onClick={incrementCheddar} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/raclette.png" alt="Raclette" width={55} height={55} />
									<p className="text-xs mt-1">Raclette</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementRaclette} className="text-sm">-</button>
											<span className="text-sm">{racletteQuantity}</span>
											<button onClick={incrementRaclette} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/reblochon.png" alt="Reblochon" width={55} height={55} />
									<p className="text-xs mt-1">Reblochon</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementReblochon} className="text-sm">-</button>
											<span className="text-sm">{reblochonQuantity}</span>
											<button onClick={incrementReblochon} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/chevre.png" alt="Chevre" width={55} height={55} />
									<p className="text-xs mt-1">Chèvre</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementChevre} className="text-sm">-</button>
												<span className="text-sm">{chevreQuantity}</span>
											<button onClick={incrementChevre} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/poitrine.png" alt="Poitrine fumée" width={55} height={55} />
									<p className="text-xs mt-1">Poitrine fumée</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPoitrine} className="text-sm">-</button>
											<span className="text-sm">{poitrineQuantity}</span>
											<button onClick={incrementPoitrine} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/galette-de-pomme-de-terre.png" alt="Galette de pomme de terre" width={55} height={55} />
									<p className="text-xs mt-1">Galette de pomme de terre</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementGalettePommeTerre} className="text-sm">-</button>
											<span className="text-sm">{galettePommeTerreQuantity}</span>
											<button onClick={incrementGalettePommeTerre} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/galette-de-fromage.png" alt="Galette de fromage" width={55} height={55} />
									<p className="text-xs mt-1">Galette de fromage</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementGaletteFromage} className="text-sm">-</button>
											<span className="text-sm">{galetteFromageQuantity}</span>
											<button onClick={incrementGaletteFromage} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/maroille.png" alt="Maroille" width={55} height={55} />
									<p className="text-xs mt-1">Maroille</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementMaroille} className="text-sm">-</button>
											<span className="text-sm">{maroilleQuantity}</span>
											<button onClick={incrementMaroille} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/oeuf.png" alt="Oeuf" width={55} height={55} />
									<p className="text-xs mt-1">Oeuf</p>
									<p className="text-xs mt-1">1€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementOeuf} className="text-sm">-</button>
											<span className="text-sm">{oeufQuantity}</span>
											<button onClick={incrementOeuf} className="text-sm">+</button>
									</div>
							</button>
					</div>
					</div>
					<div className="flex flex-col items-center justify-center mt-10 gap-8">
						<button className="button-blue text-sm w-40">
							Valider
						</button>
					</div>
				</div>
    );
}

export default Supplements;
