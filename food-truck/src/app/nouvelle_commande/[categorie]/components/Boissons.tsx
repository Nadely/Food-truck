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

  useEffect(() => {
    // Récupérer directement les boissons depuis dataProduits.json
    const boissons = dataProduits.Boissons || [];
    setProducts(boissons);
  }, []);

  const handleSelectBoisson = (id: number) => {
    setSelectedBoisson(id);
  };

  const handleAddToCart = () => {
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
  };

  return (
    <div className="style-pen text-xl mb-5 mt-2">
      <div className="flex flex-col items-center justify-center border-b-2 border-white text-white text-2xl gap-4 mb-5">
        Boissons
      </div>
      <div className="w-full flex flex-col items-center justify-center mt-4 style-pen text-lg mb-5">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 mb-5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex flex-col items-center justify-center gap-4 flex-grow basis-[160px] max-w-[200px] ${
                  selectedBoisson === product.id
                    ? "bg-green-200 border-4 border-green-500 rounded-lg"
                    : ""
                }`}
              >
                <div
                  className="relative shadow-light flex flex-col items-center justify-center gap-4 rounded-lg p-2 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
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
                  <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-2 text-center border-t border-black rounded-b-lg">
                    <p className="text-sm mt-auto">{product.name}</p>
                  </div>
                </div>
                {!viaSupplements && (
                  <p className="text-sm text-white border-2 border-white w-full text-center rounded-md mt-auto">
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
