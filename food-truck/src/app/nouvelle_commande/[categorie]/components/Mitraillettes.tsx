"use client";

import Link from "next/link";
import data from "../../dataProduits.json";

const Mitraillettes = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-2 font-bold font-serif text-2xl">
      <h1 className="border-b-2 border-black w-full text-center">Mitraillettes</h1>
      <div className="inline-block w-full flex flex-row items-center justify-center mt-10 font-serif text-lg gap-8 mb-5">
        {data.Mitraillettes.map((product) => (
          <Link
            key={product.id}
            href={
              product.id === 1
                ? "/snacks"
                : product.id === 3
                ? "/brochettes"
                : "#"
            }
          >
            <button
              className="button-green flex flex-col items-center justify-center"
              style={{ width: "200px", height: "200px" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-3/4 object-cover mb-2"
              />
              <span>{product.name}</span>
              <span>{product.price}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Mitraillettes;
