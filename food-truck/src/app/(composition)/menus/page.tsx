import Link from "next/link";

const Menus = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Menus</h1>
				<div className="inline-block w-full flex flex-row items-center justify-center mt-20 font-serif text-lg gap-4 mb-5">
						<button className="button-green items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/mitraillettes">Mitraillettes</Link>
						</button>
						<button className="button-yellow items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/burgers">Burgers</Link>
						</button>
						<button className="button-blue items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/veggies">Veggies</Link>
						</button>
						<button className="button-red items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/enfants">Menus enfants</Link>
						</button>
				</div>

		</div>
    )
}

export default Menus;
