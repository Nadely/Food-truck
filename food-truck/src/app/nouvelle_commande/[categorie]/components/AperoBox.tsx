"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import data from "@/data/dataProduits.json";
import { useCart } from "@/app/context/CartContext";

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
    const itemsToAdd = data.AperoBox
      .map((product) => {
        const quantity = quantities[product.id];
        if (quantity > 0) {
          return {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity,
          };
        }
        return null;
      })
      .filter(Boolean);

    if (itemsToAdd.length > 0) {
      itemsToAdd.forEach((item) => addToCart(item));

      // Construire l'URL avec toutes les AperoBox sélectionnées et leurs quantités
      const aperoBoxParams = Object.entries(quantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const box = data.AperoBox.find((product) => product.id === parseInt(id));
          return box ? `${box.name}=${quantity}` : "";
        })
        .join("&");

      // Rediriger vers la page des sauces
      router.push(`Sauces?viaAperoBox=true&${aperoBoxParams}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center font-bold font-serif mt-2 text-2xl">
      <h1 className="border-b-2 border-black w-full text-center mr-5">
        AperoBox
      </h1>
      <div className="w-full flex flex-col items-center justify-center mt-4 font-serif text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
            {data.AperoBox.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center gap-4 border-2 border-black rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform duration-200 hover:shadow-md shadow-sm"
                style={{ width: "200px", height: "200px" }}
                onClick={() => handleSelectAperoBox(product.name)} // Sélectionner ou désélectionner
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                />
                <p className="text-sm mt-auto">{product.name}</p>
                <p className="text-sm mt-auto">{product.price}</p>
                <div className="flex flex-row items-center gap-4">
                  <button
                    onClick={() => handleDecrement(product.id)}
                    className="text-sm px-2 py-1  bg-red-500 focus:ring-4 rounded-lg px-8 py-2 "
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
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="button-blue w-40 mt-10 mb-5"
<<<<<<< HEAD
            onClick={handleAddToCart}
=======
            onClick={() => {
              if (Object.values(quantities).some((qty) => qty > 0)) {
                router.push("Sauces?viaAperoBox=true");
              } else {
                alert(
                  "Veuillez sélectionner au moins une quantité avant de valider !"
                );
              }
            }}
>>>>>>> 6b6d5e3 (Refactor and clean up styling in AperoBox and Brochettes components)
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default AperoBox;
