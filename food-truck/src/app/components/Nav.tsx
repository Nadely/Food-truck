"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Nav = () => {
    const pathname = usePathname();
    const categories = pathname.split('/').pop();
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Change the key to force re-render and restart the animation
        setAnimationKey(prevKey => prevKey + 1);
    }, [categories]);

    return (
        <div className="flex xl:w-1/6 md:w-1/3 w-1/2">
            <Link href="/" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                Accueil
            </Link>
            {categories !== '' && (
                <div key={animationKey} className="flex flex-col border-2 animate-fillLeftToRight h-1 bg-red-200 mt-5">
                </div>
            )}
            {categories === 'commandes' && (
                <Link href="/commandes" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Commandes
                </Link>
            )}
            {categories === 'stocks' && (
                <Link href="/stocks" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Stocks
                </Link>
            )}
            {categories === 'historique' && (
                <Link href="/historique" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Historique
                </Link>
            )}
            {categories === 'evenements' && (
                <Link href="/evenements" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Evènements
                </Link>
            )}
        </div>
    );
};

export default Nav;
