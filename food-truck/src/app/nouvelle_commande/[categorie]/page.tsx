import Brochettes from "./components/Brochettes";
import Mitraillettes from "./components/Mitraillettes";
import Sauces from "./components/Sauces";
import Snacks from "./components/Snacks";
// import Desserts from "./components/Desserts";
// import Garnitures from "./components/Garnitures";


const CategoriePage = async ({ params }: { params: { categorie: string } }) => {
  const { categorie } = await params; // Attendre les paramètres

  // Afficher un composant en fonction de la catégorie
  switch (categorie) {
    case "Mitraillettes":
      return <Mitraillettes />;
    case "Snacks":
      return <Snacks />;
    case "Brochettes":
      return <Brochettes />;
    case "Sauces":
      return <Sauces />;
    // case "Desserts":
    //   return <Desserts />;
    // case "Garnitures":
    //   return <Garnitures />;
    default:
      return <div>Catégorie inconnue !</div>;
  }
};

export default CategoriePage;
