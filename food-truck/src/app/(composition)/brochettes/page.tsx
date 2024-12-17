"use client";

import Image from "next/image";
import { useState } from "react";

const Brochettes = () => {
	const [volailleQuantity, setVolailleQuantity] = useState(0);
	const [tziganeQuantity, setTziganeQuantity] = useState(0);
	const [ardennaiseQuantity, setArdennaiseQuantity] = useState(0);
	const [poissonQuantity, setPoissonQuantity] = useState(0);
	const [porcQuantity, setPorcQuantity] = useState(0);
	const [boeufQuantity, setBoeufQuantity] = useState(0);

	const incrementVolaille = () => setVolailleQuantity(volailleQuantity + 1);
	const decrementVolaille = () => setVolailleQuantity(volailleQuantity > 0 ? volailleQuantity - 1 : 0);

	const incrementTzigane = () => setTziganeQuantity(tziganeQuantity + 1);
	const decrementTzigane = () => setTziganeQuantity(tziganeQuantity > 0 ? tziganeQuantity - 1 : 0);

	const incrementArdennaise = () => setArdennaiseQuantity(ardennaiseQuantity + 1);
	const decrementArdennaise = () => setArdennaiseQuantity(ardennaiseQuantity > 0 ? ardennaiseQuantity - 1 : 0);

	const incrementPoisson = () => setPoissonQuantity(poissonQuantity + 1);
	const decrementPoisson = () => setPoissonQuantity(poissonQuantity > 0 ? poissonQuantity - 1 : 0);

	const incrementPorc = () => setPorcQuantity(porcQuantity + 1);
	const decrementPorc = () => setPorcQuantity(porcQuantity > 0 ? porcQuantity - 1 : 0);

	const incrementBoeuf = () => setBoeufQuantity(boeufQuantity + 1);
	const decrementBoeuf = () => setBoeufQuantity(boeufQuantity > 0 ? boeufQuantity - 1 : 0);

    return (
			<div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
			<h1 className="border-b-2 border-black w-full text-center mr-5">Brochettes</h1>
			<div className="inline-block w-full flex flex-col items-center justify-center mt-20 font-serif text-sm gap-4 mb-5">
					<div className="flex flex-row items-center justify-center gap-8">
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/volaille.jpg" alt="Volaille" width={55} height={55} />
									<p className="text-xs mt-1">Volaille</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementVolaille} className="text-sm">-</button>
											<span className="text-sm">{volailleQuantity}</span>
											<button onClick={incrementVolaille} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/tzigane.jpg" alt="Tzigane" width={55} height={55} />
									<p className="text-xs mt-1">Tzigane</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementTzigane} className="text-sm">-</button>
											<span className="text-sm">{tziganeQuantity}</span>
											<button onClick={incrementTzigane} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/ardennaise.jpg" alt="Ardennaise" width={55} height={55} />
									<p className="text-xs mt-1">Ardennaise</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementArdennaise} className="text-sm">-</button>
											<span className="text-sm">{ardennaiseQuantity}</span>
											<button onClick={incrementArdennaise} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/poisson.jpg" alt="Poisson" width={55} height={55} />
									<p className="text-xs mt-1">Poisson</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPoisson} className="text-sm">-</button>
											<span className="text-sm">{poissonQuantity}</span>
											<button onClick={incrementPoisson} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/porc.jpg" alt="Porc" width={55} height={55} />
									<p className="text-xs mt-1">Porc</p>
									<p className="text-xs mb-1">4,5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementPorc} className="text-sm">-</button>
											<span className="text-sm">{porcQuantity}</span>
											<button onClick={incrementPorc} className="text-sm">+</button>
									</div>
							</button>
							<button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
									<Image src="/boeuf.jpg" alt="Boeuf" width={55} height={55} />
									<p className="text-xs mt-1">Boeuf</p>
									<p className="text-xs mb-1">5€</p>
									<div className="flex flex-row items-center gap-4">
											<button onClick={decrementBoeuf} className="text-sm">-</button>
											<span className="text-sm">{boeufQuantity}</span>
											<button onClick={incrementBoeuf} className="text-sm">+</button>
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

export default Brochettes;
