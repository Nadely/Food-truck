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
};

export default Nav;
