"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AperosBox = () => {
	const [funBoxQuantity, setFunBoxQuantity] = useState(0);
	const [spicyBoxQuantity, setSpicyBoxQuantity] = useState(0);
	const [cheeseBoxQuantity, setCheeseBoxQuantity] = useState(0);
	const [chickenBoxQuantity, setChickenBoxQuantity] = useState(0);
	const [veganBoxQuantity, setVeganBoxQuantity] = useState(0);
	const [partyBoxQuantity, setPartyBoxQuantity] = useState(0);


	const incrementFunBox = () => setFunBoxQuantity(funBoxQuantity + 1);
	const decrementFunBox = () => setFunBoxQuantity(funBoxQuantity > 0 ? funBoxQuantity - 1 : 0);

	const incrementSpicyBox = () => setSpicyBoxQuantity(spicyBoxQuantity + 1);
	const decrementSpicyBox = () => setSpicyBoxQuantity(spicyBoxQuantity > 0 ? spicyBoxQuantity - 1 : 0);

	const incrementCheeseBox = () => setCheeseBoxQuantity(cheeseBoxQuantity + 1);
	const decrementCheeseBox = () => setCheeseBoxQuantity(cheeseBoxQuantity > 0 ? cheeseBoxQuantity - 1 : 0);

	const incrementChickenBox = () => setChickenBoxQuantity(chickenBoxQuantity + 1);
	const decrementChickenBox = () => setChickenBoxQuantity(chickenBoxQuantity > 0 ? chickenBoxQuantity - 1 : 0);

	const incrementVeganBox = () => setVeganBoxQuantity(veganBoxQuantity + 1);
	const decrementVeganBox = () => setVeganBoxQuantity(veganBoxQuantity > 0 ? veganBoxQuantity - 1 : 0);

	const incrementPartyBox = () => setPartyBoxQuantity(partyBoxQuantity + 1);
	const decrementPartyBox = () => setPartyBoxQuantity(partyBoxQuantity > 0 ? partyBoxQuantity - 1 : 0);


    return (
			<div className="flex flex-col items-center justify-center0 font-bold font-serif mt-10 text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Apéros Box</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center font-serif text-lg mt-10">
							<div className="flex flex-row items-center justify-center gap-8">
								<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/funbox.jpg" alt="Fun Box" width={100} height={100} />
									<p className="text-sm mt-auto">Fun Box</p>
									<p className="text-sm mb-auto">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementFunBox} className="text-sm">-</button>
											<span className="text-sm">{funBoxQuantity}</span>
											<button onClick={incrementFunBox} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/spicybox.jpg" alt="Spicy Box" width={100} height={100} />
									<p className="text-sm mt-auto">Spicy Box</p>
									<p className="text-sm mb-auto">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementSpicyBox} className="text-sm">-</button>
											<span className="text-sm">{spicyBoxQuantity}</span>
											<button onClick={incrementSpicyBox} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/cheesebox.jpg" alt="Cheese Box" width={100} height={100} />
									<p className="text-sm mt-auto">Cheese Box</p>
									<p className="text-sm mb-auto">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementCheeseBox} className="text-sm">-</button>
											<span className="text-sm">{cheeseBoxQuantity}</span>
											<button onClick={incrementCheeseBox} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/chickenbox.jpg" alt="Chicken Box" width={100} height={100} />
									<p className="text-sm mt-auto">Chicken Box</p>
									<p className="text-sm mb-auto">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementChickenBox} className="text-sm">-</button>
											<span className="text-sm">{chickenBoxQuantity}</span>
											<button onClick={incrementChickenBox} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/veganbox.jpg" alt="Vegan Box" width={100} height={100} />
									<p className="text-sm mt-auto">Vegan Box</p>
									<p className="text-sm mb-auto">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementVeganBox} className="text-sm">-</button>
											<span className="text-sm">{veganBoxQuantity}</span>
											<button onClick={incrementVeganBox} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/partybox.jpg" alt="Party Box" width={100} height={100} />
									<p className="text-sm mt-auto">Party Box</p>
									<p className="text-sm mb-auto">11€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPartyBox} className="text-sm">-</button>
											<span className="text-sm">{partyBoxQuantity}</span>
											<button onClick={incrementPartyBox} className="text-sm">+</button>
									</div>
							</button>
					</div>
					<div className="flex flex-col items-center justify-center mt-10">
						<button className="button-blue w-40">
							<Link href="/sauces">Valider</Link>
						</button>
					</div>
				</div>
			</div>
    )
}

export default AperosBox;
