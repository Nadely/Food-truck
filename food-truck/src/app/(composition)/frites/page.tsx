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
        <div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
            <h1 className="border-b-2 border-black w-full text-center mr-5">Frites</h1>
            <div className="inline-block w-full flex flex-row items-center justify-center mt-20 font-serif text-sm gap-4 mb-5">
                <div className="flex flex-col items-center">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '180px', height: '180px' }}>
                        <Image src="/frites.jpg" alt="Frites petites" width={55} height={55} />
                        <p className="text-xs mt-3">Petites</p>
                        <p className="text-xs mb-1">3,5€</p>
                    </button>
                    <div className="flex flex-row items-center gap-4">
                        <button onClick={decrementSmall} className="text-sm">-</button>
                        <span className="text-sm">{smallFriesQuantity}</span>
                        <button onClick={incrementSmall} className="text-sm">+</button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '180px', height: '180px' }}>
                        <Image src="/frites.jpg" alt="Frites grandes" width={75} height={75} />
                        <p className="text-xs mt-1">Grandes</p>
                        <p className="text-xs mb-1">4,5€</p>
                    </button>
                    <div className="flex flex-row items-center gap-4">
                        <button onClick={decrementLarge} className="text-sm">-</button>
                        <span className="text-sm">{largeFriesQuantity}</span>
                        <button onClick={incrementLarge} className="text-sm">+</button>
                    </div>
                </div>
            </div>
            <button className="button-blue items-center justify-center text-sm" style={{ width: '180px', height: '50px' }}>
                <Link href="/choixSauces">
                    Valider
                </Link>
            </button>
        </div>
    )
}

export default Frites;
