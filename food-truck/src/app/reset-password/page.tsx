"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, tu pourrais appeler une API pour envoyer un email de réinitialisation
    setMessage("Si cet email existe, un lien de réinitialisation a été envoyé.");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
      {/* Image d'arrière-plan */}
      <Image
        src="/ardoise.jpg"
        alt="ardoise"
        fill
        style={{ objectFit: "cover", zIndex: 0 }}
        priority
      />
      <form onSubmit={handleSubmit} className="relative z-10 p-8 rounded shadow-md w-96 bg-black bg-opacity-70">
        <h1 className="text-2xl font-bold text-white mb-6 text-center style-pen">Reinitialiser le mot de passe</h1>
        <label className="text-white style-pen block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 style-pen mb-2">Envoyer le lien</button>
        <button type="button" className="w-full text-white p-2 hover:text-blue-600 style-pen" onClick={() => router.push("/login")}>Retour a la connexion</button>
        {message && <div className="text-green-400 mt-4 text-center">{message}</div>}
      </form>
    </div>
  );
}
