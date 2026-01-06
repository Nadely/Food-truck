"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Product } from "../../../../types/allTypes";
import { useCart } from "../../../context/CartContext";
import dataProduits from "../../../../data/dataProduits.json";

const Boissons = () => {
  const searchParams = useSearchParams();
  const viaSupplements = searchParams.get("viaSupplements") === "true";
  const router = useRouter();
  const { addToCart } = useCart();
  const menus = searchParams.get("menu") === "true";
  const groupId = searchParams.get("groupId") || `drink-${Date.now()}`;

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBoisson, setSelectedBoisson] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const boissons = dataProduits.Boissons || [];
    setProducts(boissons);
    // Initialiser les quantités à 0 pour chaque produit
    const initialQuantities = boissons.reduce((acc: { [key: number]: number }, product) => {
      acc[product.id] = 0;
      return acc;
    }, {});
    setQuantities(initialQuantities);
  }, []);

  const handleIncrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 0) - 1, 0),
    }));
  };

  const handleSelectBoisson = (id: number) => {
    if (viaSupplements) {
      setSelectedBoisson(id);
    }
  };

  const handleAddToCart = () => {
    if (viaSupplements) {
      if (selectedBoisson !== null) {
        const selectedProduct = products.find(product => product.id === selectedBoisson);
        if (selectedProduct) {
          const isLeffe = selectedProduct.name.toLowerCase().includes('leffe');
          const calculatedPrice = menus ? (isLeffe ? 3.5 : 1) : parseFloat(selectedProduct.price);

          const item = {
            id: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.image || "/default-drink.png",
            price: calculatedPrice,
            quantity: 1,
            uniqueId: `${selectedProduct.id}-${Date.now()}`,
            menuOption: menus,
            supplementPrice: 0,
            isBoisson: true,
            groupId: groupId,
            relatedItems: []
          };

          addToCart(item);
        }
      }
      router.push("/nouvelle_commande");
    } else {
      // Ajouter toutes les boissons avec une quantité > 0
      const itemsToAdd = products
        .filter(product => quantities[product.id] > 0)
        .map(product => {
          const isLeffe = product.name.toLowerCase().includes('leffe');
          const calculatedPrice = menus ? (isLeffe ? 3.5 : 1) : parseFloat(product.price);

          return {
            id: product.id,
            name: product.name,
            image: product.image || "/default-drink.png",
            price: calculatedPrice,
            quantity: quantities[product.id],
            uniqueId: `${product.id}-${Date.now()}`,
            menuOption: menus,
            supplementPrice: 0,
            isBoisson: true,
            groupId: `drink-${Date.now()}`,
            relatedItems: []
          };
        });

      if (itemsToAdd.length > 0) {
        itemsToAdd.forEach(item => addToCart(item));
        router.push("/nouvelle_commande");
      } else {
        alert("Veuillez sélectionner au moins une boisson !");
      }
    }
  };

  return (
    <div className="style-pen text-black text-xl mb-5 mt-2">
      <div className="flex flex-col text-black items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Boissons
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 mb-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center gap-2 flex-grow basis-[140px] max-w-[160px]"
              >
                <div
                  className={`relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square ${
                    viaSupplements && selectedBoisson === product.id ? 'ring-4 ring-green-500 bg-green-200' : ''
                  }`}
                  onClick={() => handleSelectBoisson(product.id)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1 text-center border-t border-black rounded-b-lg">
                    <p className="text-xs mt-auto mb-0.5">{product.name}</p>
                    {!viaSupplements && (
                      <div className="flex flex-row items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecrement(product.id);
                          }}
                          className="text-xs bg-red-500 focus:ring-2 rounded-lg px-1 py-0.5"
                        >
                          -
                        </button>
                        <span className="text-xs">{quantities[product.id] || 0}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleIncrement(product.id);
                          }}
                          className="text-xs bg-green-500 focus:ring-2 rounded-lg px-1 py-0.5"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {!viaSupplements && (
                  <p className="text-xs text-white border border-white w-full text-center rounded-md mt-1 p-0.5">
                    {menus ? (product.name.toLowerCase().includes('leffe') ? "3.5€" : "1€") : product.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            className="bg-yellow-100 rounded-md bg-opacity-80 w-40 mb-5"
            onClick={handleAddToCart}
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Boissons;
