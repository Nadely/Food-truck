"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "../../../../data/dataProduits.json";
import { useCart } from "../../../context/CartContext";

const AperoBox = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedAperoBoxes, setSelectedAperoBoxes] = useState<string[]>([]); // Tableau pour stocker les AperoBox sélectionnées

  const [quantities, setQuantities] = useState<{ [key: number]: number }>(
    data.AperoBox.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );

  const handleIncrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] > 0 ? prevQuantities[id] - 1 : 0,
    }));
  };

  const handleSelectAperoBox = (name: string) => {
    setSelectedAperoBoxes((prev) => {
      if (prev.includes(name)) {
        // Si AperoBox est déjà sélectionnée, on la désélectionne
        return prev.filter((box) => box !== name);
      } else {
        // Sinon, on l'ajoute
        return [...prev, name];
      }
    });
  };

  const handleAddToCart = () => {
    const itemsToAdd = data.AperoBox.map((product) => {
      const quantity = quantities[product.id];
      if (quantity > 0) {
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          price: parseFloat(product.price),
          quantity,
        };
      }
      return null;
    }).filter(Boolean);

    if (itemsToAdd.length > 0) {
      const groupId = `aperobox-${Date.now()}`;
      itemsToAdd.forEach((item) => addToCart({...item, groupId}));

      // Construire l'URL avec toutes les AperoBox sélectionnées et leurs quantités
      const aperoBoxParams = Object.entries(quantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const box = data.AperoBox.find(
            (product) => product.id === parseInt(id)
          );
          return box ? `${box.name}=${quantity}` : "";
        })
        .join("&");

      // Rediriger vers la page des sauces
      router.push(`Sauces?viaAperoBox=true&groupId=${groupId}&${aperoBoxParams}`);
    }
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Apero Box
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.AperoBox.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center gap-4"
                >
                <div
                className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md"
                style={{ width: "200px", height: "200px" }}
                onClick={() => handleSelectAperoBox(product.name)} // Sélectionner ou désélectionner
              >
                <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg ">
                  <p className="text-sm mt-auto">{product.name}</p>
                  <div className="flex flex-row items-center gap-4">
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="text-sm px-2 py-1  bg-red-500 focus:ring-4 rounded-lg px-8 py-2 ml-3"
                    >
                      -
                    </button>
                    <span className="text-sm">{quantities[product.id]}</span>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="text-sm px-2 py-1 rounded-lg bg-green-500 focus:ring-4 rounded-lg px-8 py-2 "
                    >
                      +
                    </button>
                  </div>
                </div>
                  </div>
                <p className="text-sm text-white border-2 border-white w-full text-center rounded-md p-1">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mt-10 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default AperoBox;
