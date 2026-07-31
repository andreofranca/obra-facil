"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  profissionalId: string;
  initialIsFavorito: boolean;
}

export function FavoriteButton({ profissionalId, initialIsFavorito }: FavoriteButtonProps) {
  const [isFavorito, setIsFavorito] = useState(initialIsFavorito);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorito) {
        await fetch(`/api/favoritos?profissionalId=${profissionalId}`, {
          method: "DELETE",
        });
        setIsFavorito(false);
      } else {
        await fetch(`/api/favoritos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profissionalId }),
        });
        setIsFavorito(true);
      }
      router.refresh();
    } catch (error) {
      console.error("Erro ao favoritar", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full border transition-all flex items-center justify-center ${
        isFavorito 
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
          : 'bg-white border-neutral-border text-neutral-text hover:bg-neutral-surface'
      }`}
      aria-label={isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart className={`w-5 h-5 ${isFavorito ? 'fill-red-500' : ''}`} />
    </button>
  );
}
