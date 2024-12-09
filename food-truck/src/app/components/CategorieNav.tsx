import Link from "next/link";
import Image from "next/image";

const CategorieNav = () => {
  return (
    <div className="flex flex-col justify-center items-center top-110 gap-4">
      <Link href="/commandes">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src="/Commandes.png"
            alt="Stocks"
            width={150}
            height={150}
            className="rounded-lg border-2 border-black object-cover"
          />
          <div className="absolute inset-0 flex justify-center items-center text-xl font-bold font-serif text-black">
            Commandes
          </div>
        </div>
      </Link>
      <Link href="/stocks">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src="/Stocks.png"
            alt="Stocks"
            width={150}
            height={150}
            className="rounded-lg border-2 border-black object-cover"
          />
          <div className="absolute inset-0 flex justify-center items-center text-xl font-bold font-serif text-black">
            Stocks
          </div>
        </div>
      </Link>
      <Link href="/historique">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src="/Historique.png"
            alt="Historique"
            width={150}
            height={150}
            className="rounded-lg border-2 border-black object-cover"
          />
          <div className="absolute inset-0 flex justify-center items-center text-xl font-bold font-serif text-black">
            Historique
          </div>
        </div>
      </Link>
      <Link href="/evenements">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src="/Evenements.png"
            alt="Evènements"
            width={150}
            height={150}
            className="rounded-lg border-2 border-black object-cover"
          />
          <div className="absolute inset-0 flex justify-center items-center text-xl font-bold font-serif text-black">
            Evènements
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategorieNav;
