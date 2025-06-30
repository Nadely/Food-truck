"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false
    });
    if (res?.ok) {
      router.push("/acceuiladmin");
    } else {
      setError("Identifiants invalides");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header avec drapeau en fond */}
      <div className="relative w-full h-[120px] flex items-center justify-center">
        <Image
          src="/drapeau.jpg"
          alt="drapeau"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <h1 className="relative z-10 text-white text-6xl font-bold style-pen text-shadow-lg">
          La petite Belgique des Coevrons
        </h1>
      </div>

      {/* Zone de connexion avec ardoise en fond */}
      <div className="relative flex-grow flex items-center justify-center">
        <Image
          src="/ardoise.jpg"
          alt="ardoise"
          fill
          style={{ objectFit: "cover", zIndex: 0 }}
          priority
        />
        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="relative z-10 p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold text-white mb-6 text-center style-pen">Connexion</h1>
          <label className="text-white style-pen block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <label className="text-white style-pen block mb-2">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 style-pen">Se connecter</button>
          <button type="button" className="w-full text-white p-2 hover:text-blue-600 style-pen" onClick={() => router.push("/reset-password/")}>mot de passe oublie ?</button>
        </form>
      </div>
    </div>
  );
}
