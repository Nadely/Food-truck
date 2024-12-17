import Link from "next/link"

const ChoixBoissons = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-20 font-serif gap-4 mb-5">
                <h2 className="text-center text-xl">Vous voulez une boisson ?</h2>
                <div className="flex flex-row text-center text-sm gap-8">
                    <button className="button-green items-center justify-center" style={{ width: '150px', height: '50px' }}>
                        <Link href="/boissons">
                            Oui
                        </Link>
                    </button>
                    <button className="button-red items-center justify-center" style={{ width: '150px', height: '50px' }}>
                        <Link href="">
                            Non
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChoixBoissons;
