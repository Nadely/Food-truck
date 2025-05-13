"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const Horaires = () => {
  const router = useRouter();
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(null);
  const [userName, setUserName] = useState(""); // Nom de l'utilisateur
  const [userPhone, setUserPhone] = useState(""); // Téléphone de l'utilisateur
  const { cart, setCart } = useCart(); // Panier

  const handleSelectHours = async (hour: string) => {
    setSelectedHoraire(hour);

    // Chercher si un élément "horaire" existe déjà dans le panier
    const existingOrderIndex = cart.findIndex(item => item.id === "horaire");

    // Si l'horaire existe déjà, on met à jour l'heure
    const updatedCart = [...cart];
    if (existingOrderIndex !== -1) {
      updatedCart[existingOrderIndex] = {
        ...updatedCart[existingOrderIndex],
        time: hour, // Met à jour l'horaire
      };
    } else {
      // Sinon, on ajoute un nouvel élément horaire
      updatedCart.push({
        id: "horaire",
        name: "", // Pas de nom pour cet élément
        price: 0, // Prix fictif
        quantity: 1,
        time: hour, // Ajout de l'horaire
      });
    }

    // Mettre à jour le panier
    setCart(updatedCart);

    // Calculer le prix total du panier
    const totalPrice = updatedCart.reduce((acc, item) => {
      if (item.price > 0) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);

    // Envoi des données au backend pour enregistrer la commande
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
            relatedItems: item.relatedItems ? item.relatedItems.map((related) => related.name) : [],
          })),
          user_name: userName, // Nom du client
          user_phone: userPhone, // Téléphone du client
          user_image: "/avatar.jpg",
          time: hour,
          date: new Date().toISOString(),
          lieu: "Maison", // Lieu par défaut
          price: `${totalPrice}€`, // Prix calculé
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'ajout");

      console.log("Commande ajoutée au panier :", data);

      // Redirection vers l'écran des horaires après validation
      router.push("/horaires");
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

  // Couleurs des boutons par horaire
  const categorieColors: Record<string, string> = {
    "18h": "",
    "18h15": "",
    "18h30": "",
    "18h45": "",
    "19h": "",
    "19h15": "",
    "19h30": "",
    "19h45": "",
    "20h": "",
    "20h15": "",
    "20h30": "",
    "20h45": "",
    "21h": "",
    "21h15": "",
    "21h30": "",
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Horaires
      </div>

              {/* Champs de saisie pour le nom et le téléphone de l'utilisateur */}
              <div className="flex flex-col items-center justify-center mt-4">
                <input
                  type="text"
                  className="border-2 border-black rounded-md mt-10 mb-4 w-80 text-center"
                  placeholder="Entrez votre nom"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                <input
                  type="text"
                  className="border-2 border-black rounded-md mt-2 mb-4 w-80 text-center"
                  placeholder="Entrez votre telephone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />

      {/* Grille des horaires */}
      <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 mb-5">
        {Object.keys(categorieColors).map((hour) => (
          <button
            key={hour}
            className={`relative shadow-light text-white flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md
              ${selectedHoraire === hour
                ? "bg-green-400 border-4 border-black scale-105"
                : `${categorieColors[hour]} hover:bg-green-400 hover:scale-105`
              }`}
            style={{ width: "150px", height: "150px" }}
            onClick={() => handleSelectHours(hour)}
          >
            {hour}
          </button>
        ))}
      </div>

        {/* Bouton de validation */}
        <button
          className={`bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5 ${
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
