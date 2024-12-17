import Image from "next/image";

const Enfants = () => {
	return (
		<div className="flex flex-col items-center justify-center0 font-bold font-serif text-2xl">
				<h1 className="border-b-2 border-black w-full text-center mr-5">Menus enfants</h1>
				<div className="inline-block w-full flex flex-col items-center justify-center font-serif text-sm gap-4">
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center mt-2">Le snack</p>
							<div className="flex flex-row items-center justify-center  gap-4">
								<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/poulycroc.jpg" alt="Poulycroc" width={55} height={55} />
									<p className="text-xs mt-1">Poulycroc</p>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/fricadelle.jpg" alt="Fricadelle" width={55} height={55} />
									<p className="text-xs mt-1">Fricadelle</p>
							</button>
							<button className="bg-purple-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/nuggets.jpg" alt="Nuggets" width={55} height={55} />
									<p className="text-xs mt-1">Nuggets</p>
							</button>
					</div>
					<div className="flex flex-col items-center justify-center gap-4">
						<p className="text-center mt-2">Le dessert</p>
							<div className="flex flex-row items-center justify-center  gap-4">
								<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/compote.jpg" alt="Compote" width={55} height={55} />
									<p className="text-xs mt-1">Compote</p>
							</button>
							<button className="bg-green-200 border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '140px', height: '140px' }}>
									<Image src="/yaourt.jpg" alt="Yaourt au chocolat" width={55} height={55} />
									<p className="text-xs mt-1">Yaourt au chocolat</p>
							</button>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center gap-8">
						<button className="button-blue w-40 mt-10">
							Valider *
						</button>
					</div>
					<p className="text-xs text-right">* le menu enfant est automatiquement accompagner de frites et d'un Capri-sun</p>
				</div>
			</div>
	)
}

export default Enfants;
