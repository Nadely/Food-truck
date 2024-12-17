"use client"

import { useState } from "react";
import Image from "next/image";

const Sauces = () => {
	const [ketchupQuantity, setKetchupQuantity] = useState(0);
	const [mayonnaiseQuantity, setMayonnaiseQuantity] = useState(0);
	const [andalouseQuantity, setAndalouseQuantity] = useState(0);
	const [bickyQuantity, setBickyQuantity] = useState(0);
	const [dallasQuantity, setDallasQuantity] = useState(0);
	const [hamburgerQuantity, setHamburgerQuantity] = useState(0);
	const [pitaQuantity, setPitaQuantity] = useState(0);
	const [brazilQuantity, setBrazilQuantity] = useState(0);
	const [hannibaleQuantity, setHannibaleQuantity] = useState(0);
	const [hawaïQuantity, setHawaïQuantity] = useState(0);
	const [richeQuantity, setRicheQuantity] = useState(0);
	const [sweetCurryOignonQuantity, setSweetCurryOignonQuantity] = useState(0);
	const [chimayoQuantity, setChimayoQuantity] = useState(0);
	const [chtiQuantity, setChtiQuantity] = useState(0);
	const [hotMammouthQuantity, setHotMammouthQuantity] = useState(0);
	const [poivreQuantity, setPoivreQuantity] = useState(0);
	const [samouraiQuantity, setSamouraiQuantity] = useState(0);


	const incrementKetchup = () => setKetchupQuantity(ketchupQuantity + 1);
	const decrementKetchup = () => setKetchupQuantity(ketchupQuantity > 0 ? ketchupQuantity - 1 : 0);

	const incrementMayonnaise = () => setMayonnaiseQuantity(mayonnaiseQuantity + 1);
	const decrementMayonnaise = () => setMayonnaiseQuantity(mayonnaiseQuantity > 0 ? mayonnaiseQuantity - 1 : 0);

	const incrementAndalouse = () => setAndalouseQuantity(andalouseQuantity + 1);
	const decrementAndalouse = () => setAndalouseQuantity(andalouseQuantity > 0 ? andalouseQuantity - 1 : 0);

	const incrementBicky = () => setBickyQuantity(bickyQuantity + 1);
	const decrementBicky = () => setBickyQuantity(bickyQuantity > 0 ? bickyQuantity - 1 : 0);

	const incrementDallas = () => setDallasQuantity(dallasQuantity + 1);
	const decrementDallas = () => setDallasQuantity(dallasQuantity > 0 ? dallasQuantity - 1 : 0);

	const incrementHamburger = () => setHamburgerQuantity(hamburgerQuantity + 1);
	const decrementHamburger = () => setHamburgerQuantity(hamburgerQuantity > 0 ? hamburgerQuantity - 1 : 0);

	const incrementPita = () => setPitaQuantity(pitaQuantity + 1);
	const decrementPita = () => setPitaQuantity(pitaQuantity > 0 ? pitaQuantity - 1 : 0);

	const incrementBrazil = () => setBrazilQuantity(brazilQuantity + 1);
	const decrementBrazil = () => setBrazilQuantity(brazilQuantity > 0 ? brazilQuantity - 1 : 0);

	const incrementHannibale = () => setHannibaleQuantity(hannibaleQuantity + 1);
	const decrementHannibale = () => setHannibaleQuantity(hannibaleQuantity > 0 ? hannibaleQuantity - 1 : 0);

	const incrementHawaï = () => setHawaïQuantity(hawaïQuantity + 1);
	const decrementHawaï = () => setHawaïQuantity(hawaïQuantity > 0 ? hawaïQuantity - 1 : 0);

	const incrementRiche = () => setRicheQuantity(richeQuantity + 1);
	const decrementRiche = () => setRicheQuantity(richeQuantity > 0 ? richeQuantity - 1 : 0);

	const incrementSweetCurryOignon = () => setSweetCurryOignonQuantity(sweetCurryOignonQuantity + 1);
	const decrementSweetCurryOignon = () => setSweetCurryOignonQuantity(sweetCurryOignonQuantity > 0 ? sweetCurryOignonQuantity - 1 : 0);

	const incrementChimayo = () => setChimayoQuantity(chimayoQuantity + 1);
	const decrementChimayo = () => setChimayoQuantity(chimayoQuantity > 0 ? chimayoQuantity - 1 : 0);

	const incrementChti = () => setChtiQuantity(chtiQuantity + 1);
	const decrementChti = () => setChtiQuantity(chtiQuantity > 0 ? chtiQuantity - 1 : 0);

	const incrementHotMammouth = () => setHotMammouthQuantity(hotMammouthQuantity + 1);
	const decrementHotMammouth = () => setHotMammouthQuantity(hotMammouthQuantity > 0 ? hotMammouthQuantity - 1 : 0);

	const incrementPoivre = () => setPoivreQuantity(poivreQuantity + 1);
	const decrementPoivre = () => setPoivreQuantity(poivreQuantity > 0 ? poivreQuantity - 1 : 0);

	const incrementSamourai = () => setSamouraiQuantity(samouraiQuantity + 1);
	const decrementSamourai = () => setSamouraiQuantity(samouraiQuantity > 0 ? samouraiQuantity - 1 : 0);

    return (
			<div className="flex flex-col items-center justify-center0 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Sauces</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center font-serif text-sm gap-4">
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center mt-2">Classiques</p>
							<div className="flex flex-row items-center justify-center  gap-4">
								<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/ketchup.png" alt="Ketchup" width={55} height={55} />
									<p className="text-xs mt-1">Ketchup</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementKetchup} className="text-sm">-</button>
											<span className="text-sm">{ketchupQuantity}</span>
											<button onClick={incrementKetchup} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/mayonnaise.jpeg" alt="Mayonnaise" width={55} height={55} />
									<p className="text-xs mt-1">Mayonnaise</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementMayonnaise} className="text-sm">-</button>
											<span className="text-sm">{mayonnaiseQuantity}</span>
											<button onClick={incrementMayonnaise} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/andalouse.jpg" alt="Andalouse" width={55} height={55} />
									<p className="text-xs mt-1">Andalouse</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementAndalouse} className="text-sm">-</button>
											<span className="text-sm">{andalouseQuantity}</span>
											<button onClick={incrementAndalouse} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/bicky.jpg" alt="Bicky" width={55} height={55} />
									<p className="text-xs mt-1">Bicky</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBicky} className="text-sm">-</button>
											<span className="text-sm">{bickyQuantity}</span>
											<button onClick={incrementBicky} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/dallas.jpg" alt="Dallas" width={55} height={55} />
									<p className="text-xs mt-1">Dallas</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementDallas} className="text-sm">-</button>
											<span className="text-sm">{dallasQuantity}</span>
											<button onClick={incrementDallas} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/hamburger.jpg" alt="Hamburger" width={55} height={55} />
									<p className="text-xs mt-1">Hamburger</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementHamburger} className="text-sm">-</button>
											<span className="text-sm">{hamburgerQuantity}</span>
											<button onClick={incrementHamburger} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/pita.jpg" alt="Pita" width={55} height={55} />
									<p className="text-xs mt-1">Pita</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPita} className="text-sm">-</button>
											<span className="text-sm">{pitaQuantity}</span>
											<button onClick={incrementPita} className="text-sm">+</button>
									</div>
							</button>
							</div>
							<div className="flex flex-col items-center justify-center gap-4">
								<p className="text-center">Sucrées</p>
							<div className="flex flex-row items-center justify-center gap-4">
							<button className="bg-yellow-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/brazil.jpeg" alt="Brazil" width={55} height={55} />
									<p className="text-xs mt-1">Brazil</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBrazil} className="text-sm">-</button>
											<span className="text-sm">{brazilQuantity}</span>
											<button onClick={incrementBrazil} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-yellow-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/hannibale.png" alt="Hannibal" width={55} height={55} />
									<p className="text-xs mt-1">Hannibale</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementHannibale} className="text-sm">-</button>
											<span className="text-sm">{hannibaleQuantity}</span>
											<button onClick={incrementHannibale} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-yellow-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/hawai.jpg" alt="Hawaï" width={55} height={55} />
									<p className="text-xs mt-1">Hawaï</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementHawaï} className="text-sm">-</button>
											<span className="text-sm">{hawaïQuantity}</span>
											<button onClick={incrementHawaï} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-yellow-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/riche.jpeg" alt="Riche" width={55} height={55} />
									<p className="text-xs mt-1">Riche</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementRiche} className="text-sm">-</button>
											<span className="text-sm">{richeQuantity}</span>
											<button onClick={incrementRiche} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-yellow-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/sweet-curry-oignon.jpg" alt="Sweet Curry Oignon" width={55} height={55} />
									<p className="text-xs mt-1">Sweet Curry Oignon</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementSweetCurryOignon} className="text-sm">-</button>
											<span className="text-sm">{sweetCurryOignonQuantity}</span>
											<button onClick={incrementSweetCurryOignon} className="text-sm">+</button>
									</div>
							</button>
							</div>
							<div className="flex flex-col items-center justify-center gap-4">
								<p className="text-center">Epicés</p>
								<div className="flex flex-row items-center justify-center gap-4">
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/chimayo.jpg" alt="Chimayo" width={55} height={55} />
									<p className="text-xs mt-1">Chimayo</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementChimayo} className="text-sm">-</button>
											<span className="text-sm">{chimayoQuantity}</span>
											<button onClick={incrementChimayo} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/chti.jpg" alt="Ch'ti" width={55} height={55} />
									<p className="text-xs mt-1">Ch'ti</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementChti} className="text-sm">-</button>
											<span className="text-sm">{chtiQuantity}</span>
											<button onClick={incrementChti} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/hot-mammouth.jpg" alt="Hot Mammouth" width={55} height={55} />
									<p className="text-xs mt-1">Hot Mammouth</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementHotMammouth} className="text-sm">-</button>
											<span className="text-sm">{hotMammouthQuantity}</span>
											<button onClick={incrementHotMammouth} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/poivre.jpg" alt="Poivre" width={55} height={55} />
									<p className="text-xs mt-1">Poivre</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPoivre} className="text-sm">-</button>
											<span className="text-sm">{poivreQuantity}</span>
											<button onClick={incrementPoivre} className="text-sm">+</button>
									</div>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/samourai.jpg" alt="Samourai" width={55} height={55} />
									<p className="text-xs mt-1">Samourai</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementSamourai} className="text-sm">-</button>
											<span className="text-sm">{samouraiQuantity}</span>
											<button onClick={incrementSamourai} className="text-sm">+</button>
									</div>
							</button>
								</div>
							</div>
					</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-8">
						<button className="button-blue w-40 mt-10">
							Valider *
						</button>
					</div>
					<p className="text-xs text-right">* la première est gratuite, 0.50€/sauce à partir de la deuxième</p>
				</div>
			</div>
    )
}

export default Sauces;
