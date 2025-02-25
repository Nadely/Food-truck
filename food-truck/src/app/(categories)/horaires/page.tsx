"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

const Horaires = () => {
  const router = useRouter();
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(null);
  const { addToCart, cart } = useCart(); // Ajout du panier

	const handleSelectHours = async (hour: string) => {
		setSelectedHoraire(hour);

		// Simuler l'ajout d'un choix au panier (prix fictif par exemple)
		const choicePrice = 0;  // Exemple de prix pour "Commande pour {hour}"
		addToCart({
			id: "horaire",
			name: `Commande pour ${hour}`,
			price: choicePrice,
			quantity: 1,
		});


		// Calculer le prix total du panier
		const totalPrice = cart.reduce((acc, item) => {
      if (item.price > 0) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);

		// 🔥 Envoi à l'API panier pour l'enregistrer
		try {
			const res = await fetch("/api/panier", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: Date.now(),
					image: "/images/nouvelle_commande.jpg",
					items: cart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            relatedItems: item.relatedItems ? item.relatedItems.map(related => related.name) : [], // Si relatedItems est défini
          })),
           // Liste des choix
					user_name: "Nouveau Client",
					user_image: "/avatar.jpg",
					time: hour,
					date: new Date().toISOString(),
					lieu: "Maison",
					price: `${totalPrice}€`, // Prix total calculé
					createdAt: new Date().toISOString(),
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout");

			console.log("Commande ajoutée au panier :", data);
		} catch (error) {
			console.error("Erreur lors de l'ajout au panier :", error);
		}
	};


  const handleValidate = async () => {
    if (!selectedHoraire) return;

    try {
      const response = await fetch("/api/panier", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/commandes"); // Redirection après validation
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    }
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
              ${
                selectedHoraire === hour
                  ? "bg-green-400 border-4 border-black scale-105"
                  : `${categorieColors[hour]} hover:bg-green-400 border-2 border-black hover:scale-105`
              }`}
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
          className={`button-blue w-40 mt-10 mb-5 ${
            !selectedHoraire ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleValidate}
          disabled={!selectedHoraire}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Horaires;
