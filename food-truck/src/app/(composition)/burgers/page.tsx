'use client'

import Link from "next/link";
import { useState } from "react";

const Burgers = () => {
	const [doubleGarniture, setDoubleGarniture] = useState(false);

	const handleCheckboxChange = () => {
		setDoubleGarniture(!doubleGarniture);
		// Logique pour ajouter 3€ au panier peut être ajoutée ici
	};

	return (
		<div className="flex flex-col items-center justify-center mt-10 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Burgers</h1>
				<div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
						<button className="button-green items-center justify-center" style={{ width: '200px', height: '200px' }}>
							<Link href="">Burger</Link>
						</button>
						<button className="button-yellow items-center justify-center" style={{ width: '200px', height: '200px' }}>
								<Link href="">Mexicanos Burger</Link>
						</button>
						<button className="button-blue items-center justify-center" style={{ width: '200px', height: '200px' }}>
								<Link href="">Fish Burger</Link>
						</button>
						<button className="button-purple items-center justify-center" style={{ width: '200px', height: '200px' }}>
								<Link href="">Chiken Burger</Link>
						</button>
						<button className="button-orange items-center justify-center" style={{ width: '200px', height: '200px' }}>
								<Link href="">Crispy Burger</Link>
						</button>
				</div>
				<div>
					<label className="flex items-center gap-2 text-lg">
						Double garniture ?*
						<input
							type="checkbox"
							checked={doubleGarniture}
							onChange={handleCheckboxChange}
						/>

					</label>
				</div>
				<div className="flex flex-col items-center justify-center mt-10 gap-8">
					<button className="button-blue text-lg w-40"> Valider </button>
				</div>
				<div className="text-sm text-center mt-2">* en cochant cette case, vous ajoutez 3€ au panier</div>
		</div>
    )
}

export default Burgers;
