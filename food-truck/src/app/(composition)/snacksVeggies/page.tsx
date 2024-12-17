"use client";

import Image from "next/image";
import { useState } from "react";

const SnacksVeggies = () => {
	const [belcantoZeroMeatQuantity, setBelcantoZeroMeatQuantity] = useState(0);
	const [fricadelleZeroMeatQuantity, setFricadelleZeroMeatQuantity] = useState(0);
	const [hamburgerZeroMeatQuantity, setHamburgerZeroMeatQuantity] = useState(0);
	const [poulycrocVegiQuantity, setPoulycrocVegiQuantity] = useState(0);


	const incrementBelcantoZeroMeat = () => setBelcantoZeroMeatQuantity(belcantoZeroMeatQuantity + 1);
	const decrementBelcantoZeroMeat = () => setBelcantoZeroMeatQuantity(belcantoZeroMeatQuantity > 0 ? belcantoZeroMeatQuantity - 1 : 0);

	const incrementFricadelleZeroMeat = () => setFricadelleZeroMeatQuantity(fricadelleZeroMeatQuantity + 1);
	const decrementFricadelleZeroMeat = () => setFricadelleZeroMeatQuantity(fricadelleZeroMeatQuantity > 0 ? fricadelleZeroMeatQuantity - 1 : 0);

	const incrementHamburgerZeroMeat = () => setHamburgerZeroMeatQuantity(hamburgerZeroMeatQuantity + 1);
	const decrementHamburgerZeroMeat = () => setHamburgerZeroMeatQuantity(hamburgerZeroMeatQuantity > 0 ? hamburgerZeroMeatQuantity - 1 : 0);

	const incrementPoulycrocVegi = () => setPoulycrocVegiQuantity(poulycrocVegiQuantity + 1);
	const decrementPoulycrocVegi = () => setPoulycrocVegiQuantity(poulycrocVegiQuantity > 0 ? poulycrocVegiQuantity - 1 : 0);


    return (
			<div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Snacks Veggies</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center mt-20 font-serif text-sm gap-4 mb-5">
					<div className="flex flex-row items-center justify-center gap-8">
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/belcanto-zero-meat.jpg" alt="Belcanto Zero Meat" width={55} height={55} />
									<p className="text-xs mt-1">Belcanto Zero Meat</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBelcantoZeroMeat} className="text-sm">-</button>
											<span className="text-sm">{belcantoZeroMeatQuantity}</span>
											<button onClick={incrementBelcantoZeroMeat} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/fricadelle-zero-meat.jpg" alt="Fricadelle Zero Meat" width={55} height={55} />
									<p className="text-xs mt-1">Fricadelle Zero Meat</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementFricadelleZeroMeat} className="text-sm">-</button>
											<span className="text-sm">{fricadelleZeroMeatQuantity}</span>
											<button onClick={incrementFricadelleZeroMeat} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/hamburger-zero-meat.jpg" alt="Hamburger Zero Meat" width={55} height={55} />
									<p className="text-xs mt-1">Hamburger Zero Meat</p>
									<p className="text-xs mb-1">4€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementHamburgerZeroMeat} className="text-sm">-</button>
											<span className="text-sm">{hamburgerZeroMeatQuantity}</span>
											<button onClick={incrementHamburgerZeroMeat} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/poulycroc-vegi.jpg" alt="Poulycroc Vegi" width={55} height={55} />
									<p className="text-xs mt-1">Poulycroc Vegi</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPoulycrocVegi} className="text-sm">-</button>
											<span className="text-sm">{poulycrocVegiQuantity}</span>
											<button onClick={incrementPoulycrocVegi} className="text-sm">+</button>
									</div>
							</button>
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

export default SnacksVeggies;
