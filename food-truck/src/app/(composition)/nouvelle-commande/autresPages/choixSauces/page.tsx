import Link from "next/link"

const ChoixSauces = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-20 font-serif gap-4 mb-5">
                <h2 className="text-center text-xl font-bold font-serif">Voulez-vous une sauce ?</h2>
                <div className="flex flex-row text-center text-lg gap-8">
                    <button className="button-green items-center justify-center" style={{ width: '200px', height: '200px' }}>
                        <Link href="/sauces">
                            Oui
                        </Link>
                    </button>
                    <button className="button-red items-center justify-center" style={{ width: '200px', height: '200px' }}>
                        <Link href="">
                            Non
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChoixSauces;
