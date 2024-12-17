import Link from "next/link";

const NouvelleCommande = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
            <h1>Faites votre choix !</h1>
            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-8 text-lg mt-20">
                <button className="button-green p-2" style={{ width: '150px', height: '150px' }}>
                    <Link href="/menus">Les Menus</Link>
                </button>
                <button className="button-yellow p-2" style={{ width: '150px', height: '150px' }}>
                    <Link href="/aperos-box">Les Apéros Box</Link>
                </button>
                <button className="button-blue p-2" style={{ width: '150px', height: '150px' }}>
                    <Link href="/solos">Les Solos</Link>
                </button>
                <button className="button-red p-2" style={{ width: '150px', height: '150px' }}>
                    <Link href="/boissons">Les Boissons</Link>
                </button>
                <button className="button-purple p-2" style={{ width: '150px', height: '150px' }}>
                    <Link href="/frites">Les Frites</Link>
                </button>
            </div>
        </div>
    )
}

export default NouvelleCommande;
