"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";  // Importer useRouter

const ModifierSelectionPage = () => {
  const router = useRouter();
  const { parentId, sauceId } = router.query;  // Utiliser router.query pour obtenir les paramètres de l'URL
  const [currentSelection, setCurrentSelection] = useState(null);
  const [updatedSelection, setUpdatedSelection] = useState(null); // Pour la nouvelle sélection

  // Fonction pour récupérer la sélection actuelle
  const getCurrentSelection = (parentId, sauceId) => {
    // Exemple de récupération du produit
    return {
      name: "Burger",
      quantity: 2,
      sauce: "spicy", // Sauce par défaut
    };
  };

  useEffect(() => {
    if (parentId && sauceId) {
      // Récupérer les données actuelles pour cette sélection
      const selection = getCurrentSelection(parentId, sauceId); // Logique pour obtenir le produit
      setCurrentSelection(selection);
      setUpdatedSelection(selection); // Initialiser avec les données actuelles
    }
  }, [parentId, sauceId]);

  const handleSelectionChange = (event) => {
    // Modifier la sélection en fonction du choix de l'utilisateur
    setUpdatedSelection({
      ...updatedSelection,
      [event.target.name]: event.target.value, // Mettre à jour la propriété modifiée
    });
  };

  const handleSaveChanges = () => {
    // Rediriger l'utilisateur vers la page du produit pour qu'il puisse sélectionner un nouveau produit
    router.push(`/produit/${parentId}`);
  };

  if (!currentSelection) return <div>Loading...</div>; // Précharge si nécessaire

  return (
    <div>
      <h2>Modifier la sélection pour {currentSelection.name}</h2>
      <p>Produit actuel: {currentSelection.name}</p>
      <p>Sauce actuelle: {currentSelection.sauce}</p>

      {/* Formulaire pour modifier la sélection */}
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="sauce">Choisissez une nouvelle sauce :</label>
        <select
          id="sauce"
          name="sauce"
          value={updatedSelection.sauce || ''}
          onChange={handleSelectionChange}
        >
          <option value="tomato">Tomato</option>
          <option value="spicy">Spicy</option>
          <option value="garlic">Garlic</option>
        </select>
      </form>

      <button onClick={handleSaveChanges}>Sélectionner un nouveau produit</button>
    </div>
  );
};

export default ModifierSelectionPage;
