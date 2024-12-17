"use client";

import Image from "next/image";
import { useState } from "react";

const Snacks = () => {
	const [poulycrocQuantity, setPoulycrocQuantity] = useState(0);
	const [viandelleQuantity, setViandelleQuantity] = useState(0);
	const [belcantoQuantity, setBelcantoQuantity] = useState(0);
	const [cervelasBrunQuantity, setCervelasBrunQuantity] = useState(0);
	const [bouffeFeuQuantity, setBouffeFeuQuantity] = useState(0);
	const [luciferQuantity, setLuciferQuantity] = useState(0);
	const [loempiaPouleQuantity, setLoempiaPouleQuantity] = useState(0);
	const [boulettesQuantity, setBoulettesQuantity] = useState(0);
	const [cheesecrackdecrementCheesecrackQuantity, setCheesecrackdecrementCheesecrackQuantity] = useState(0);
	const [loempidelQuantity, setLoempidelQuantity] = useState(0);
	const [fricadelleXXLQuantity, setFricadelleXXLQuantity] = useState(0);
	const [fricadelleQuantity, setFricadelleQuantity] = useState(0);


	const incrementFricadelle = () => setFricadelleQuantity(fricadelleQuantity + 1);
	const decrementFricadelle = () => setFricadelleQuantity(fricadelleQuantity > 0 ? fricadelleQuantity - 1 : 0);

	const incrementPoulycroc = () => setPoulycrocQuantity(poulycrocQuantity + 1);
	const decrementPoulycroc = () => setPoulycrocQuantity(poulycrocQuantity > 0 ? poulycrocQuantity - 1 : 0);

	const incrementViandelle = () => setViandelleQuantity(viandelleQuantity + 1);
	const decrementViandelle = () => setViandelleQuantity(viandelleQuantity > 0 ? viandelleQuantity - 1 : 0);

	const incrementBelcanto = () => setBelcantoQuantity(belcantoQuantity + 1);
	const decrementBelcanto = () => setBelcantoQuantity(belcantoQuantity > 0 ? belcantoQuantity - 1 : 0);

	const incrementCervelasBrun = () => setCervelasBrunQuantity(cervelasBrunQuantity + 1);
	const decrementCervelasBrun = () => setCervelasBrunQuantity(cervelasBrunQuantity > 0 ? cervelasBrunQuantity - 1 : 0);

	const incrementBouffeFeu = () => setBouffeFeuQuantity(bouffeFeuQuantity + 1);
	const decrementBouffeFeu = () => setBouffeFeuQuantity(bouffeFeuQuantity > 0 ? bouffeFeuQuantity - 1 : 0);

	const incrementLucifer = () => setLuciferQuantity(luciferQuantity + 1);
	const decrementLucifer = () => setLuciferQuantity(luciferQuantity > 0 ? luciferQuantity - 1 : 0);

	const incrementLoempiaPoule = () => setLoempiaPouleQuantity(loempiaPouleQuantity + 1);
	const decrementLoempiaPoule = () => setLoempiaPouleQuantity(loempiaPouleQuantity > 0 ? loempiaPouleQuantity - 1 : 0);

	const incrementBoulettes = () => setBoulettesQuantity(boulettesQuantity + 1);
	const decrementBoulettes = () => setBoulettesQuantity(boulettesQuantity > 0 ? boulettesQuantity - 1 : 0);

	const incrementCheesecrackdecrementCheesecrack = () => setCheesecrackdecrementCheesecrackQuantity(cheesecrackdecrementCheesecrackQuantity + 1);
	const decrementCheesecrack = () => setCheesecrackdecrementCheesecrackQuantity(cheesecrackdecrementCheesecrackQuantity > 0 ? cheesecrackdecrementCheesecrackQuantity - 1 : 0);

	const incrementLoempidel = () => setLoempidelQuantity(loempidelQuantity + 1);
	const decrementLoempidel = () => setLoempidelQuantity(loempidelQuantity > 0 ? loempidelQuantity - 1 : 0);

	const incrementFricadelleXXL = () => setFricadelleXXLQuantity(fricadelleXXLQuantity + 1);
	const decrementFricadelleXXL = () => setFricadelleXXLQuantity(fricadelleXXLQuantity > 0 ? fricadelleXXLQuantity - 1 : 0);

    return (
			<div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Snacks</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center mt-20 font-serif text-sm gap-4 mb-5">
					<div className="flex flex-col items-center justify-center gap-8">
							<div className="flex flex-row items-center justify-center gap-4">
								<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/fricadelle.jpg" alt="Fricadelle" width={55} height={55} />
									<p className="text-xs mt-1">Fricadelle</p>
									<p className="text-xs mb-1">3,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementFricadelle} className="text-sm">-</button>
											<span className="text-sm">{fricadelleQuantity}</span>
											<button onClick={incrementFricadelle} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/fricadelle-xxl.jpg" alt="Fricadelle XXL" width={55} height={55} />
									<p className="text-xs mt-1">Fricadelle XXL</p>
									<p className="text-xs mb-1">6€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementFricadelleXXL} className="text-sm">-</button>
											<span className="text-sm">{fricadelleXXLQuantity}</span>
											<button onClick={incrementFricadelleXXL} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/poulycroc.jpg" alt="Poulycroc" width={55} height={55} />
									<p className="text-xs mt-1">Poulycroc</p>
									<p className="text-xs mb-1">3,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPoulycroc} className="text-sm">-</button>
											<span className="text-sm">{poulycrocQuantity}</span>
											<button onClick={incrementPoulycroc} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/viandelle.jpeg" alt="Viandelle" width={55} height={55} />
									<p className="text-xs mt-1">Viandelle</p>
									<p className="text-xs mb-1">3,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementViandelle} className="text-sm">-</button>
											<span className="text-sm">{viandelleQuantity}</span>
											<button onClick={incrementViandelle} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/belcanto.jpg" alt="Belcanto" width={55} height={55} />
									<p className="text-xs mt-1">Belcanto</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBelcanto} className="text-sm">-</button>
											<span className="text-sm">{belcantoQuantity}</span>
											<button onClick={incrementBelcanto} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/cervelas-brun.jpeg" alt="Cervelas brun" width={55} height={55} />
									<p className="text-xs mt-1">Cervelas brun</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementCervelasBrun} className="text-sm">-</button>
											<span className="text-sm">{cervelasBrunQuantity}</span>
											<button onClick={incrementCervelasBrun} className="text-sm">+</button>
									</div>
							</button>
							</div>
							<div className="flex flex-row items-center justify-center gap-4">
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/bouffe-feu.jpeg" alt="Bouffe feu" width={55} height={55} />
									<p className="text-xs mt-1">Bouffe feu</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBouffeFeu} className="text-sm">-</button>
											<span className="text-sm">{bouffeFeuQuantity}</span>
											<button onClick={incrementBouffeFeu} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/lucifer.jpg" alt="Lucifer" width={55} height={55} />
									<p className="text-xs mt-1">Lucifer</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementLucifer} className="text-sm">-</button>
											<span className="text-sm">{luciferQuantity}</span>
											<button onClick={incrementLucifer} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/loempia-poulet.jpg" alt="Loempia poulet" width={55} height={55} />
									<p className="text-xs mt-1">Loempia poulet</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementLoempiaPoule} className="text-sm">-</button>
											<span className="text-sm">{loempiaPouleQuantity}</span>
											<button onClick={incrementLoempiaPoule} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/boulette.jpeg" alt="Boulettes" width={55} height={55} />
									<p className="text-xs mt-1">Boulettes</p>
									<p className="text-xs mb-1">3,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBoulettes} className="text-sm">-</button>
											<span className="text-sm">{boulettesQuantity}</span>
											<button onClick={incrementBoulettes} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/cheese-crack.jpg" alt="Cheese crackdecrementCheesecrack" width={55} height={55} />
									<p className="text-xs mt-1">Cheese crack</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementCheesecrack} className="text-sm">-</button>
											<span className="text-sm">{cheesecrackdecrementCheesecrackQuantity}</span>
											<button onClick={incrementCheesecrackdecrementCheesecrack} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/loempidel.jpeg" alt="Loempidel" width={55} height={55} />
									<p className="text-xs mt-1">Loempidel</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementLoempidel} className="text-sm">-</button>
											<span className="text-sm">{loempidelQuantity}</span>
											<button onClick={incrementLoempidel} className="text-sm">+</button>
									</div>
							</button>
							</div>
					</div>
					<div className="flex flex-col items-center justify-center gap-8">
						<button className="button-blue w-40 mt-10 mb-5">
							Valider
						</button>
					</div>
				</div>
			</div>
    )
}

export default Snacks;
