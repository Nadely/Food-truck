"use client";

import Image from 'next/image';
import { useState } from 'react';

const Boissons = () => {
    const [cocaQuantity, setCocaQuantity] = useState(0);
    const [cocaZeroQuantity, setCocaZeroQuantity] = useState(0);
    const [fantaCitronQuantity, setFantaCitronQuantity] = useState(0);
    const [fantaOrangeQuantity, setFantaOrangeQuantity] = useState(0);
    const [canadaDryQuantity, setCanadaDryQuantity] = useState(0);
    const [oranginaQuantity, setOranginaQuantity] = useState(0);
    const [sevenUpQuantity, setSevenUpQuantity] = useState(0);
    const [capriSunQuantity, setCapriSunQuantity] = useState(0);
    const [iceTeaQuantity, setIceTeaQuantity] = useState(0);
    const [oasisQuantity, setOasisQuantity] = useState(0);
    const [tropicoQuantity, setTropicoQuantity] = useState(0);
    const [eauQuantity, setEauQuantity] = useState(0);
    const [eauPerillanteQuantity, setEauPerillanteQuantity] = useState(0);
    const [leffeQuantity, setLeffeQuantity] = useState(0);
    const [leffeBlancheQuantity, setLeffeBlancheQuantity] = useState(0);
    const [leffeRubyQuantity, setLeffeRubyQuantity] = useState(0);

    const incrementCoca = () => setCocaQuantity(cocaQuantity + 1);
    const decrementCoca = () => setCocaQuantity(cocaQuantity > 0 ? cocaQuantity - 1 : 0);

    const incrementCocaZero = () => setCocaZeroQuantity(cocaZeroQuantity + 1);
    const decrementCocaZero = () => setCocaZeroQuantity(cocaZeroQuantity > 0 ? cocaZeroQuantity - 1 : 0);

    const incrementFantaCitron = () => setFantaCitronQuantity(fantaCitronQuantity + 1);
    const decrementFantaCitron = () => setFantaCitronQuantity(fantaCitronQuantity > 0 ? fantaCitronQuantity - 1 : 0);

    const incrementFantaOrange = () => setFantaOrangeQuantity(fantaOrangeQuantity + 1);
    const decrementFantaOrange = () => setFantaOrangeQuantity(fantaOrangeQuantity > 0 ? fantaOrangeQuantity - 1 : 0);

    const incrementOrangina = () => setOranginaQuantity(oranginaQuantity + 1);
    const decrementOrangina = () => setOranginaQuantity(oranginaQuantity > 0 ? oranginaQuantity - 1 : 0);

    const incrementSevenUp = () => setSevenUpQuantity(sevenUpQuantity + 1);
    const decrementSevenUp = () => setSevenUpQuantity(sevenUpQuantity > 0 ? sevenUpQuantity - 1 : 0);

    const incrementCapriSun = () => setCapriSunQuantity(capriSunQuantity + 1);
    const decrementCapriSun = () => setCapriSunQuantity(capriSunQuantity > 0 ? capriSunQuantity - 1 : 0);

    const incrementIceTea = () => setIceTeaQuantity(iceTeaQuantity + 1);
    const decrementIceTea = () => setIceTeaQuantity(iceTeaQuantity > 0 ? iceTeaQuantity - 1 : 0);

    const incrementOasis = () => setOasisQuantity(oasisQuantity + 1);
    const decrementOasis = () => setOasisQuantity(oasisQuantity > 0 ? oasisQuantity - 1 : 0);

    const incrementTropico = () => setTropicoQuantity(tropicoQuantity + 1);
    const decrementTropico = () => setTropicoQuantity(tropicoQuantity > 0 ? tropicoQuantity - 1 : 0);

    const incrementEau = () => setEauQuantity(eauQuantity + 1);
    const decrementEau = () => setEauQuantity(eauQuantity > 0 ? eauQuantity - 1 : 0);

    const incrementEauPerillante = () => setEauPerillanteQuantity(eauPerillanteQuantity + 1);
    const decrementEauPerillante = () => setEauPerillanteQuantity(eauPerillanteQuantity > 0 ? eauPerillanteQuantity - 1 : 0);

    const incrementLeffe = () => setLeffeQuantity(leffeQuantity + 1);
    const decrementLeffe = () => setLeffeQuantity(leffeQuantity > 0 ? leffeQuantity - 1 : 0);

    const incrementLeffeBlanche = () => setLeffeBlancheQuantity(leffeBlancheQuantity + 1);
    const decrementLeffeBlanche = () => setLeffeBlancheQuantity(leffeBlancheQuantity > 0 ? leffeBlancheQuantity - 1 : 0);

    const incrementLeffeRuby = () => setLeffeRubyQuantity(leffeRubyQuantity + 1);
    const decrementLeffeRuby = () => setLeffeRubyQuantity(leffeRubyQuantity > 0 ? leffeRubyQuantity - 1 : 0);

    const incrementCanadaDry = () => setCanadaDryQuantity(canadaDryQuantity + 1);
    const decrementCanadaDry = () => setCanadaDryQuantity(canadaDryQuantity > 0 ? canadaDryQuantity - 1 : 0);

    return (
        <div className="flex flex-col items-center justify-center mt-20 font-bold font-serif text-2xl">
            <h1 className="border-b-2 border-black w-full text-center mr-5">Boissons</h1>
            <div className="inline-block w-full flex flex-col items-center justify-center mt-20 font-serif text-sm gap-4 mb-5">
                <div className="flex flex-row items-center justify-center gap-8">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/coca-cola.jpg" alt="Coca Cola" width={55} height={55} />
                        <p className="text-xs mt-1">Coca Cola</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementCoca} className="text-sm">-</button>
                            <span className="text-sm">{cocaQuantity}</span>
                            <button onClick={incrementCoca} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/coca-cola-zero.png" alt="Coca-Cola Zero" width={55} height={55} />
                        <p className="text-xs mt-1">Coca-Cola Zero</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementCocaZero} className="text-sm">-</button>
                            <span className="text-sm">{cocaZeroQuantity}</span>
                            <button onClick={incrementCocaZero} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/fanta-citron.png" alt="Fanta citron" width={55} height={55} />
                        <p className="text-xs mt-1">Fanta citron</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementFantaCitron} className="text-sm">-</button>
                            <span className="text-sm">{fantaCitronQuantity}</span>
                            <button onClick={incrementFantaCitron} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/fanta-orange.jpg" alt="Fanta orange" width={55} height={55} />
                        <p className="text-xs mt-1">Fanta orange</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementFantaOrange} className="text-sm">-</button>
                            <span className="text-sm">{fantaOrangeQuantity}</span>
                            <button onClick={incrementFantaOrange} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/canada-dry.jpeg" alt="canada-dry" width={55} height={55} />
                        <p className="text-xs mt-1">Canada Dry</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementCanadaDry} className="text-sm">-</button>
                            <span className="text-sm">{canadaDryQuantity}</span>
                            <button onClick={incrementCanadaDry} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/orangina.jpg" alt="Orangina" width={55} height={55} />
                        <p className="text-xs mt-1">Orangina</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementOrangina} className="text-sm">-</button>
                            <span className="text-sm">{oranginaQuantity}</span>
                            <button onClick={incrementOrangina} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/seven-up.jpg" alt="Seven Up" width={55} height={55} />
                        <p className="text-xs mt-1">Seven Up</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementSevenUp} className="text-sm">-</button>
                            <span className="text-sm">{sevenUpQuantity}</span>
                            <button onClick={incrementSevenUp} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/capri-sun.jpg" alt="Capri-Sun" width={55} height={55} />
                        <p className="text-xs mt-1">Capri-Sun</p>
                        <p className="text-xs mb-1">1€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementCapriSun} className="text-sm">-</button>
                            <span className="text-sm">{capriSunQuantity}</span>
                            <button onClick={incrementCapriSun} className="text-sm">+</button>
                        </div>
                    </button>
                </div>
                <div className="flex flex-row items-center justify-center gap-8">
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/ice-tea.png" alt="Ice Tea" width={55} height={55} />
                        <p className="text-xs mt-1">Ice Tea</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementIceTea} className="text-sm">-</button>
                            <span className="text-sm">{iceTeaQuantity}</span>
                            <button onClick={incrementIceTea} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/oasis.jpg" alt="Oasis" width={55} height={55} />
                        <p className="text-xs mt-1">Oasis</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementOasis} className="text-sm">-</button>
                            <span className="text-sm">{oasisQuantity}</span>
                            <button onClick={incrementOasis} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/tropico.jpg" alt="Tropico" width={55} height={55} />
                        <p className="text-xs mt-1">Tropico</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementTropico} className="text-sm">-</button>
                            <span className="text-sm">{tropicoQuantity}</span>
                            <button onClick={incrementTropico} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/eau.png" alt="Eau" width={55} height={55} />
                        <p className="text-xs mt-1">Eau</p>
                        <p className="text-xs mb-1">1€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementEau} className="text-sm">-</button>
                            <span className="text-sm">{eauQuantity}</span>
                            <button onClick={incrementEau} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/eau-pétillante.jpg" alt="Eau pétillante" width={55} height={55} />
                        <p className="text-xs mt-1">Eau pétillante</p>
                        <p className="text-xs mb-1">1,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementEauPerillante} className="text-sm">-</button>
                            <span className="text-sm">{eauPerillanteQuantity}</span>
                            <button onClick={incrementEauPerillante} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/leffe.jpg" alt="Leffe" width={55} height={55} />
                        <p className="text-xs mt-1">Leffe</p>
                        <p className="text-xs mb-1">3,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementLeffe} className="text-sm">-</button>
                            <span className="text-sm">{leffeQuantity}</span>
                            <button onClick={incrementLeffe} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/leffe-blanche.png" alt="Leffe Blanche" width={55} height={55} />
                        <p className="text-xs mt-1">Leffe Blanche</p>
                        <p className="text-xs mb-1">3,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementLeffeBlanche} className="text-sm">-</button>
                            <span className="text-sm">{leffeBlancheQuantity}</span>
                            <button onClick={incrementLeffeBlanche} className="text-sm">+</button>
                        </div>
                    </button>
                    <button className="border-2 border-black rounded-lg p-2 flex flex-col items-center justify-center" style={{ width: '150px', height: '150px' }}>
                        <Image src="/leffe-ruby.jpg" alt="Leffe Ruby" width={55} height={55} />
                        <p className="text-xs mt-1">Leffe Ruby</p>
                        <p className="text-xs mb-1">3,5€</p>
                        <div className="flex flex-row items-center gap-4">
                            <button onClick={decrementLeffeRuby} className="text-sm">-</button>
                            <span className="text-sm">{leffeRubyQuantity}</span>
                            <button onClick={incrementLeffeRuby} className="text-sm">+</button>
                        </div>
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center gap-8">
                    <button className="button-blue w-40 mt-10 mb-5">
                        Valider
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Boissons;
