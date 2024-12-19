"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Frites = () => {
    const [smallFriesQuantity, setSmallFriesQuantity] = useState(0);
    const [largeFriesQuantity, setLargeFriesQuantity] = useState(0);

    const incrementSmall = () => setSmallFriesQuantity(smallFriesQuantity + 1);
    const decrementSmall = () => setSmallFriesQuantity(smallFriesQuantity > 0 ? smallFriesQuantity - 1 : 0);

    const incrementLarge = () => setLargeFriesQuantity(largeFriesQuantity + 1);
    const decrementLarge = () => setLargeFriesQuantity(largeFriesQuantity > 0 ? largeFriesQuantity - 1 : 0);

    return (
        <div className="flex flex-col items-center justify-center mt-10 font-bold font-serif text-2xl">
            <h1 className="border-b-2 border-black w-full text-center mr-5">Frites</h1>
            <div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
                <div className="flex flex-col items-center">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
                        <Image src="/frites.jpg" alt="Frites petites" width={80} height={80} />
                        <p className="text-sm mt-auto">Petites</p>
                        <p className="text-sm mb-auto">3,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementSmall} className="text-sm">-</button>
                            <span className="text-sm">{smallFriesQuantity}</span>
                            <button onClick={incrementSmall} className="text-sm">+</button>
                    </div>
                    </button>

                </div>
                <div className="flex flex-col items-center">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
                        <Image src="/frites.jpg" alt="Frites grandes" width={100} height={100} />
                        <p className="text-sm mt-auto">Grandes</p>
                        <p className="text-sm mb-auto">4,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementLarge} className="text-sm">-</button>
                            <span className="text-sm">{largeFriesQuantity}</span>
                            <button onClick={incrementLarge} className="text-sm">+</button>
                    </div>
                    </button>

                </div>
            </div>
            <button className="button-blue items-center justify-center text-lg" style={{ width: '180px', height: '50px' }}>
                <Link href="/choixSauces">
                    Valider
                </Link>
            </button>
        </div>
    )
}

export default Frites;
