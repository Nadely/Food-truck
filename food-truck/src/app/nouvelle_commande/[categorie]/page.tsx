import React from "react";
import Mitraillettes from "./components/Mitraillettes";
import Snacks from "./components/Snacks";

const CategoriePage = ({ params }: { params: { categorie: string } }) => {
  const { categorie } = params; // Vérifiez si cette ligne ne génère pas d'erreur

  // Afficher un composant en fonction de la catégorie
  switch (categorie) {
    case "Mitraillettes":
      return <Mitraillettes />;
    case "Snacks":
      return <Snacks />;
    default:
      return <div>Catégorie inconnue !</div>;
  }
};

export default CategoriePage;
