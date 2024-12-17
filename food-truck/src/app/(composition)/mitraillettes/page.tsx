import Link from "next/link";

const Mitraillettes = () => {
	return (
		<div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Mitraillettes</h1>
				<div className="inline-block w-full flex flex-row items-center justify-center mt-20 font-serif text-lg gap-4 mb-5">
						<button className="button-green items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/snacks">Classiques</Link>
						</button>
						<button className="button-yellow items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="">Filet Américain</Link>
						</button>
						<button className="button-blue items-center justify-center" style={{ width: '180px', height: '180px' }}>
								<Link href="/brochettes">Brochettes</Link>
						</button>
				</div>
		</div>
    )
}

export default Mitraillettes;
