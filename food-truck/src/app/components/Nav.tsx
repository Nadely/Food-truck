<<<<<<< HEAD
import Link from "next/link";

const Nav = () => {
  return (
    <div className="flex gap-8">
      <Link
        href="/"
        className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2"
      >
        Accueil
      </Link>

      <div className="flex gap-8">
        <Link
          href="/commandes"
          className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2"
        >
          Commandes
        </Link>

        <Link
          href="/stocks"
          className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2"
        >
          Stocks
        </Link>

        <Link
          href="/historique"
          className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2"
        >
          Historique
        </Link>

        <Link
          href="/evenements"
          className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2"
        >
          Evènements
        </Link>
      </div>
    </div>
  );
=======
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Nav = () => {
    const pathname = usePathname();
    const slug = pathname.split('/').pop();
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        // Change the key to force re-render and restart the animation
        setAnimationKey(prevKey => prevKey + 1);
    }, [slug]);

    return (
        <div className="flex gap-0">
            <Link href="/" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                Accueil
            </Link>
            {slug !== '' && (
                <div key={animationKey} className="flex flex-col border-2 animate-fillLeftToRight h-1 bg-red-200 mt-5">
                </div>
            )}
            {slug === 'commande' && (
                <Link href="/commande" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Commandes
                </Link>
            )}
            {slug === 'stocks' && (
                <Link href="/stocks" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Stocks
                </Link>
            )}
            {slug === 'historique' && (
                <Link href="/historique" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Historique
                </Link>
            )}
            {slug === 'evenements' && (
                <Link href="/evenements" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
                    Evènements
                </Link>
            )}
        </div>
    );
>>>>>>> navNad1
};

export default Nav;
