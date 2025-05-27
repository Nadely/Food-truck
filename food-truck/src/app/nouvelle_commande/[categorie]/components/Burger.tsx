      <div className="w-full grid grid-cols-3 items-center justify-center mt-10 style-pen text-lg gap-4 mb-5">
        {data.Burgers.map((product) => {
          const basePrice = parseFloat(product.price);
          const menuPrice = menus ? 2.5 : 0;
          const totalPrice = basePrice + menuPrice;

          return (
            <div
              key={product.id}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div
                className="relative shadow-light flex flex-col items-center justify-center gap-2 rounded-lg p-1.5 cursor-pointer hover:bg-green-200 hover:rouded-md hover:scale-105 transition-transform duration-200 hover:shadow-md w-full aspect-square"
                onClick={() => handleProduitClick(product)}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-yellow-100 bg-opacity-80 py-1.5 text-center border-t border-black rounded-b-lg">
                  <p className="text-lg mt-auto mb-0.5">{product.name}</p>
                </div>
              </div>
              {!viaSauces && (
                <p className="text-lg text-white border border-white w-full text-center rounded-md mt-1.5 p-1">
                  {product.price}
                </p>
              )}
            </div>
          );
        })}
      </div>
