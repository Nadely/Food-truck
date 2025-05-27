"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "../../../../types/allTypes";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";

const Sauces = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, addRelatedItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  // Récupération des paramètres via
  const viaSnacks = searchParams.get("viaSnacks") === "true";
  const viaSnacksVeggies = searchParams.get("viaSnacksVeggies") === "true";
  const viaEnfants = searchParams.get("viaEnfants") === "true";
  const viaBrochettes = searchParams.get("viaBrochettes") === "true";
  const viaMitraillette = searchParams.get("viaMitraillette") === "true";
  const viaAperoBox = searchParams.get("viaAperoBox") === "true";
  const viaFrites = searchParams.get("viaFrites") === "true";
  const isMenu = searchParams.get("menu") === "true";
  const groupId = searchParams.get("groupId");

  if (!groupId && (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette)) {
    console.error("groupId manquant dans les paramètres d'URL");
    router.push("/nouvelle_commande");
    return null;
  }

  // Détection du mode multi-sélection
  const isMultiSelect = viaFrites || viaAperoBox;

  // Calcul des sauces gratuites
  let freeSauces = 0;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des produits");
        }
        const data = await response.json();
        const isVia = viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaAperoBox || viaFrites;
        const sauces = data.products.filter((product: Product) => {
          if (product.name === "Aucune sauce") {
            return isVia;
          }
          return product.categories.includes("sauces");
        });
        setProducts(sauces);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchProducts();
  }, [viaSnacks, viaSnacksVeggies, viaEnfants, viaBrochettes, viaMitraillette, viaAperoBox, viaFrites]);

  // États locaux
  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    products.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as { [key: number]: number })
  );

  const [selectedSauce, setSelectedSauce] = useState<number[] | number | null>(
    isMultiSelect ? [] : null
  );

  // Gestion des quantités
  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  // Sélection simple ou multiple (clic)
  const handleSelectSauce = (product: Product) => {
    if (isMultiSelect) {
      setSelectedSauce((prevSelected) => {
        if (Array.isArray(prevSelected)) {
          return prevSelected.includes(product.id)
            ? prevSelected.filter((id) => id !== product.id)
            : [...prevSelected, product.id];
        }
        return [product.id];
      });
    } else if (
      viaSnacks ||
      viaSnacksVeggies ||
      viaEnfants ||
      viaBrochettes ||
      viaMitraillette
    ) {
      setSelectedSauce(product.id);
    }
  };

  // Validation
  const handleAddToCart = () => {
    const isVia =
      viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaFrites || viaAperoBox;

    if (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette) {
      if (selectedSauce !== null) {
        const product = products.find((item) => item.id === selectedSauce);
        if (product) {
          addToCart({
            id: Date.now(),
            quantity: 1,
            groupId: groupId,
            isHidden: true,
            relatedItems: [{
              id: product.id,
              name: product.name,
              image: product.image,
              price: product.name === "Aucune sauce" ? 0 : 0,
              quantity: 1,
              groupId: groupId,
              isSauces: true
            }]
          });
        }
      }
    } else {
      const selectedSauces = products
        .filter((product) => selectedSauce?.includes?.(product.id) || quantities[product.id] > 0)
        .map((product) => {
          const quantity = quantities[product.id];
          if (quantity > 0 || selectedSauce?.includes?.(product.id)) {
            return {
              id: product.id,
              name: product.name,
              image: product.image,
              quantity: quantity > 0 ? quantity : 1,
              groupId: groupId
            };
          }
          return null;
        })
        .filter(Boolean);

      const flatSauces = [];

      selectedSauces.forEach((product) => {
        for (let i = 0; i < product.quantity; i++) {
          flatSauces.push({
            id: product.id,
            name: product.name,
            image: product.image,
            groupId: groupId
          });
        }
      });

      const finalSauces = flatSauces.map((product, index) => ({
        ...product,
        price: index < freeSauces ? 0 : 0.5,
        groupId: groupId
      }));

      const grouped = {};

      finalSauces.forEach((product) => {
        if (!grouped[product.id]) {
          grouped[product.id] = {
            quantity: 1,
            totalPrice: product.price,
            price: product.price,
            groupId: groupId
          };
        } else {
          grouped[product.id].quantity += 1;
          grouped[product.id].totalPrice += product.price;
        }
      });

      Object.entries(grouped).forEach(([id, info]) => {
        const productData = products.find((p) => p.id === parseInt(id));
        if (productData) {
          if (isVia) {
            addToCart({
              uniqueId: `sauce-${productData.id}-${Date.now()}`,
              id: productData.id,
              quantity: info.quantity,
              price: info.price,
              totalPrice: info.totalPrice,
              relatedItems: [{
                id: productData.id,
                name: productData.name,
                image: productData.image,
                groupId: groupId
              }],
              groupId: groupId
            });
          } else {
            addToCart({
              uniqueId: `sauce-${productData.id}-${Date.now()}`,
              id: productData.id,
              name: productData.name,
              image: productData.image,
              quantity: info.quantity,
              price: info.price,
              totalPrice: info.totalPrice,
              groupId: groupId
            });
          }
        }
      });
    }

    // Redirection
    let nextRoute = (viaSnacks || viaSnacksVeggies || viaBrochettes || viaMitraillette)
      ? `Supplements?viaSauces=true&groupId=${groupId}`
      : "/nouvelle_commande";

    if (isMenu) {
      nextRoute += "&menu=true";
    }

    router.push(nextRoute);
  };

  return (
    <div className="font-bold style-pen text-lg mb-5 mt-2">
      <h1 className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Sauces *
      </h1>

      <div className="w-full flex flex-col items-center justify-center mt-4 mb-5">
        {/* Message d'information */}
        <p className="text-sm text-white mb-5 mt-auto">
          {viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette
            ? "* Sauce gratuite"
            : viaFrites
            ? "* La première sauce gratuite puis 0.50€ l'unité"
            : viaAperoBox
            ? "* La première sauce gratuite puis 0.50€ l'unité sauf pour Party Box (deux sauces gratuites)"
            : "* Sauces à 0.50€ l'unité"}
        </p>

        {/* Affichage des sauces */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.filter(product => {
            const isVia = viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaAperoBox || viaFrites;
            return isVia || product.name !== "Aucune sauce";
          }).map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectSauce(product)}
              className={`relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 transition-transform duration-200 hover:scale-105 ${
                (Array.isArray(selectedSauce) && selectedSauce.includes(product.id) || product.id === selectedSauce) && (viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaFrites || viaAperoBox || isMultiSelect)
                  ? "bg-green-200 border-green-500"
                  : ""
              }`}
            >
              <Image
                src={product.image}
                alt={product.name}
                width={150}
                height={150}
                className="object-contain mb-auto"
              />
              <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                <p className="text-sm">{product.name}</p>

                {/* Si mode non-via, afficher boutons +/- */}
                {!(viaSnacks || viaSnacksVeggies || viaEnfants || viaBrochettes || viaMitraillette || viaAperoBox || viaFrites) && (
                  <div className="flex flex-row items-center justify-center gap-4 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(product.id);
                      }}
                      className="text-sm bg-red-500 text-white rounded-lg px-3 py-1"
                    >
                      -
                    </button>
                    <span>{quantities[product.id] > 0 ? quantities[product.id] : ""}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(product.id);
                      }}
                      className="text-sm bg-green-500 text-white rounded-lg px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de validation */}
        <button
          className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5 py-2"
          onClick={handleAddToCart}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default Sauces;
