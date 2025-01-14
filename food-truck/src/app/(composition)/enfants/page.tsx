import Image from "next/image";

const Enfants = () => {
	return (
		<div className="flex flex-col items-center justify-center font-bold font-serif mt-10 text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Menus enfants</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center font-serif text-lg gap-4">
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center mt-2">Le snack</p>
							<div className="flex flex-row items-center justify-center  gap-4">
								<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/poulycroc.jpg" alt="Poulycroc" width={100} height={100} />
									<p className="text-sm mt-1">Poulycroc</p>
							</button>
								<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/fricadelle.jpg" alt="Fricadelle" width={100} height={100} />
									<p className="text-sm mt-1">Fricadelle</p>
							</button>
								<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/nuggets.jpg" alt="Nuggets" width={100} height={100} />
									<p className="text-sm mt-1">Nuggets</p>
							</button>
					</div>
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center mt-2">Le dessert</p>
							<div className="flex flex-row items-center justify-center  gap-4">
								<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/compote.jpg" alt="Compote" width={100} height={100} />
									<p className="text-sm mt-1">Compote</p>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '200px', height: '200px' }}>
									<Image src="/yaourt.jpg" alt="Yaourt au chocolat" width={100} height={100} />
									<p className="text-sm mt-1">Yaourt au chocolat</p>
							</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-8">
						<button className="button-blue w-40 mt-10">
							Valider *
						</button>
					</div>
					<p className="text-sm text-right">* le menu enfant est automatiquement accompagner de frites et d'un Capri-sun</p>
				</div>
			</div>
	)
}

export default Enfants;
