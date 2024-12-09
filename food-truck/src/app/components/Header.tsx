import Image from "next/image";

const Header = () => {
<<<<<<< HEAD
  return (
    <div className="relative w-screen h-[120px]">
      <Image
        src="/drapeau.jpg"
        alt="drapeau"
        layout="fill"
        objectFit="cover"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold font-serif">
        La petite Belgique des coëvrons - Admin
      </div>
      <Image
        src="/Micka.png"
        alt="logoadmin"
        width={80}
        height={70}
        className="absolute top-0 left-5"
      />
    </div>
  );
=======
    return (
        <div className="relative w-screen h-[120px]">
            <Image
                src="/drapeau.jpg"
                alt="drapeau"
                layout="fill"
                objectFit="cover"
                className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold font-serif">
       La petite Belgique des coëvrons - Admin
   </div>
            <Image
                src="/Micka.png"
                alt="logoadmin"
                width={80}
                height={70}
                className="absolute top-0 left-5"
            />
        </div>
    );
>>>>>>> navNad1
};

export default Header;
