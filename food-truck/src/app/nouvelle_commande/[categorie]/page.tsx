import Boissons from "./components/Boissons";
import Brochettes from "./components/Brochettes";
import Mitraillettes from "./components/Mitraillettes";
import Sauces from "./components/Sauces";
import Snacks from "./components/Snacks";
import Enfants from "./components/Enfants";
import Supplements from "./components/Supplements";
import SnacksVeggies from "./components/SnacksVeggies";
import Veggies from "./components/Veggies";
import Burgers from "./components/Burgers";
import AperoBox from "./components/AperoBox";
import Frites from "./components/Frites";


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
    case "Enfants":
      return <Enfants />;
    case "Supplements":
      return <Supplements />;
    case "Boissons":
       return <Boissons />;
    case "SnacksVeggies":
      return <SnacksVeggies />;
    case "Veggies":
      return <Veggies />;
    case "Burgers":
      return <Burgers />;
    case "AperoBox":
      return <AperoBox />;
    case "Frites":
      return <Frites />;
    default:
      return <div>Catégorie inconnue !</div>;
  }
};

export default CategoriePage;
