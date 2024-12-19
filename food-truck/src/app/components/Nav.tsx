"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Nav = () => {
    const pathname = usePathname();
    const categories = pathname.split('/').pop();
    const composition = pathname.split('/').pop();
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Change the key to force re-render and restart the animation
        setAnimationKey(prevKey => prevKey + 1);
    }, [categories, composition]);

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
            {composition === 'nouvelle-commande' && (
                <Link href="/nouvelle-commande" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Nouvelle Commande
                </Link>
            )}
            {composition === 'solos' && (
                <Link href="/solos" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Solos
                </Link>
            )}
            {composition === 'menus' && (
                <Link href="/menus" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Menus
                </Link>
            )}
            {composition === 'aperos-box' && (
                <Link href="/aperos-box" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Apéros Box
                </Link>
            )}
            {composition === 'boissons' && (
                <Link href="/boissons" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Boissons
                </Link>
            )}
            {composition === 'frites' && (
                <Link href="/frites" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Frites
                </Link>
            )}
            {composition === 'choixSauces' && (
                <Link href="/choixSauces" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Sauces ?
                </Link>
            )}
            {composition === 'brochettes' && (
                <Link href="/brochettes" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Brochettes
                </Link>
            )}
            {composition === 'snacksVeggies' && (
                <Link href="/snacksVeggies" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Snacks Veggies
                </Link>
            )}
            {composition === 'snacks' && (
                <Link href="/snacks" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Snacks
                </Link>
            )}
            {composition === 'sauces' && (
                <Link href="/sauces" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Sauces
                </Link>
            )}
            {composition === 'mitraillettes' && (
                <Link href="/mitraillettes" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Mitraillettes
                </Link>
            )}
            {composition === 'enfants' && (
                <Link href="/enfants" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Menus enfants
                </Link>
            )}
            {composition === 'supplements' && (
                <Link href="/supplements" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Suppléments
                </Link>
            )}
            {composition === 'burgers' && (
                <Link href="/burgers" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Burgers
                </Link>
            )}
            {composition === 'choixSupplements' && (
                <Link href="/choixSupplements" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Suppléments ?
                </Link>
            )}
            {composition === 'choixBoissons' && (
                <Link href="/choixBoissons" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Boissons ?
                </Link>
            )}
            {composition === 'veggies' && (
                <Link href="/veggies" className="inline-block whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
                    Veggies
                </Link>
            )}
        </div>
    );
};

export default Nav;
