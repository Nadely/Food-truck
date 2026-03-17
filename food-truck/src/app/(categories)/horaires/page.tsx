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

  const handleSelectHours = (hour: string) => {
    setSelectedHoraire(hour);
  };

  const handleValidate = async () => {
    if (!selectedHoraire) return;
    if (!userName.trim() || !userPhone.trim()) return;

    try {
      // Calculer le prix total du panier (simple: prix * quantité de chaque item principal)
      const totalPrice = cart.reduce((acc, item: any) => {
        const q = item.quantity ?? 1;
        const p = typeof item.price === "number" ? item.price : 0;
        return acc + p * q;
      }, 0);

      // 1) Enregistrer la commande (nom/tel/horaire requis côté backend)
      const postRes = await fetch("/api/panier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          user_name: userName.trim(),
          user_phone: userPhone.trim(),
          user_image: "/avatar.jpg",
          time: selectedHoraire,
          date: new Date().toISOString(),
          lieu: "Maison",
          price: `${totalPrice.toFixed(2)}€`,
        }),
      });

      const postData = await postRes.json().catch(() => null);
      if (!postRes.ok) throw new Error(postData?.message || "Erreur lors de l'enregistrement.");

      // 2) Transférer vers `commandes` (préparation) et vider le panier côté DB
      const putRes = await fetch("/api/panier", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const putData = await putRes.json().catch(() => null);
      if (!putRes.ok) throw new Error(putData?.message || "Erreur lors du transfert.");

      setCart([]); // Vider le panier local après validation
      router.push("/commandes");
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
    <div className="style-pen text-black text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Horaires
      </div>

              {/* Champs de saisie pour le nom et le téléphone de l'utilisateur */}
              <div className="flex flex-col items-center justify-center mt-4">
                <input
                  type="text"
                  className="border-2 border-black rounded-md mt-10 mb-4 w-80 h-10 text-center"
                  placeholder="Entrez votre nom"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                <input
                  type="text"
                  className="border-2 border-black rounded-md mt-2 mb-4 w-80 h-10 text-center"
                  placeholder="Entrez votre telephone"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                />

      {/* Grille des horaires */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 mb-5 px-4">
        {Object.keys(categorieColors).map((hour) => (
          <button
            key={hour}
            className={`relative shadow-light text-white flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md
              ${selectedHoraire === hour
                ? "bg-green-400 border-4 border-black scale-105"
                : `${categorieColors[hour]} hover:bg-green-400 hover:scale-105`
              }`}
            style={{ width: "100%", aspectRatio: "1/1", maxWidth: "200px" }}
            onClick={() => handleSelectHours(hour)}
          >
            {hour}
          </button>
        ))}
      </div>

        {/* Bouton de validation */}
        <button
          className={`bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5 ${
            !selectedHoraire || !userName.trim() || !userPhone.trim()
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleValidate}
          disabled={!selectedHoraire || !userName.trim() || !userPhone.trim()}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Horaires;
