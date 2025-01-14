import Link from "next/link";

const Solos = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-10 font-bold font-serif text-2xl">
            <h1 className="border-b-2 border-black w-full text-center mr-5">Solos</h1>
            <div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-4 mb-5">
                <button className="button-green items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/snacks">Snacks</Link>
                </button>
                <button className="button-yellow items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/brochettes">Brochettes</Link>
                </button>
                <button className="button-blue items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/snacksVeggies">Snacks Veggies</Link>
                </button>
                <button className="button-red items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/boissons">Boissons</Link>
                </button>
                <button className="button-purple items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/frites">Frites</Link>
                </button>
                <button className="button-orange items-center justify-center" style={{ width: '200px', height: '200px' }}>
                    <Link href="/sauces">Sauces</Link>
                </button>
            </div>
        </div>
    )
}

export default Solos;
