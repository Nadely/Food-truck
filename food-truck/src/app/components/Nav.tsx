"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

const Nav = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const categories = segments[segments.length - 1] || '';
  const composition = segments.includes('nouvelle_commande') ? categories : '';

  const linksCompo = [
    'nouvelle_commande', 'Solos', 'Menus', 'Aperos-box', 'Boissons', 'Frites',
    'ChoixSauces', 'Brochettes', 'SnacksVeggies', 'Snacks', 'Sauces',
    'Mitraillettes', 'Enfants', 'Supplements', 'Burgers',
    'ChoixSupplements', 'ChoixBoissons', 'Veggies'
  ];

  const renderLink = (href: string, text: string) => (
    composition === href && (
      <Link
        href={`/${href}`}
        className="whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto"
      >
        {text}
      </Link>
    )
  );

  return (
    <div className="flex w-[500px]">
      <Link href="/" className="text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2">
        Accueil
      </Link>
      {categories !== '' && (
        <div className="flex flex-col border-2 animate-fillLeftToRight h-1 bg-red-200 mt-5"></div>
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
      {(composition === 'nouvelle_commande' || linksCompo.includes(composition)) && (
        <Link href="/nouvelle_commande" className="whitespace-nowrap text-md font-bold font-serif text-black bg-red-200 border-2 border-black rounded-lg p-2 w-auto">
          Nouvelle Commande
        </Link>
      )}
      {composition !== 'nouvelle_commande' && (
        <div className="flex flex-col border-2 animate-fillLeftToRight h-1 bg-red-200 mt-5"></div>
      )}

      {renderLink('Solos', 'Solos')}
      {renderLink('Menus', 'Menus')}
      {renderLink('Aperos-box', 'Apéros Box')}
      {renderLink('Boissons', 'Boissons')}
      {renderLink('Frites', 'Frites')}
      {renderLink('ChoixSauces', 'Sauces ?')}
      {renderLink('Brochettes', 'Brochettes')}
      {renderLink('SnacksVeggies', 'Snacks Veggies')}
      {renderLink('Snacks', 'Snacks')}
      {renderLink('Sauces', 'Sauces')}
      {renderLink('Mitraillettes', 'Mitraillettes')}
      {renderLink('Enfants', 'Menus enfants')}
      {renderLink('Supplements', 'Suppléments')}
      {renderLink('Burgers', 'Burgers')}
      {renderLink('ChoixSupplements', 'Suppléments ?')}
      {renderLink('ChoixBoissons', 'Boissons ?')}
      {renderLink('Veggies', 'Veggies')}
    </div>
  );
};

export default Nav;
