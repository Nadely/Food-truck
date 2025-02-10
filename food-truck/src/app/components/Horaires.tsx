"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const Horaires = () => {
  const router = useRouter();
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleSelectHours = (hour: string) => {
    setSelectedHoraire(hour);
    addToCart({ id: "horaire", name: `Commande pour ${hour}`, price: 0 });
  };

  // 🎨 Couleurs des boutons par horaire
  const categorieColors: Record<string, string> = {
    "18h": "bg-red-200",
    "18h30": "bg-yellow-200",
    "19h": "bg-green-200",
    "19h30": "bg-blue-200",
    "20h": "bg-purple-200",
    "20h30": "bg-pink-200",
    "21h": "bg-orange-200",
    "21h30": "bg-cyan-200",
    "22h": "bg-lime-200",
    "22h30": "bg-teal-200",
    "23h": "bg-red-300",
    "23h30": "bg-gray-300",
  };

  return (
    <div className="font-bold font-serif text-lg mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-black text-2xl gap-2 mb-5">
        Horaires
      </div>

      {/* Grille des horaires */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 mb-5">
        {Object.keys(categorieColors).map((hour) => (
          <button
					key={hour}
					className={`rounded-md cursor-pointer transition-transform duration-200 shadow-sm p-3 text-black font-bold
						${selectedHoraire === hour ? "bg-green-400 border-4 border-black scale-105" : `${categorieColors[hour]} hover:bg-green-400 hover:scale-105`}`}
					style={{ width: "200px", height: "200px" }}
					onClick={() => handleSelectHours(hour)}
				>
					{hour}
				</button>
        ))}
      </div>

      {/* Bouton de validation */}
      <div className="flex flex-col items-center justify-center mt-4">
        <button
          className="button-blue w-40 mt-10 mb-5"
          onClick={() => router.push("/commandes")}
          disabled={!selectedHoraire} // Désactive si rien n'est sélectionné
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Horaires;
