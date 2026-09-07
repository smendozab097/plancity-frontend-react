import { useState } from "react";
import { addFavorite, removeFavorite } from "../services/favorite.service";

interface FavoriteButtonProps {
  eventId: string;
  isFavorite: boolean;
  onToggle?: (isFav: boolean) => void;
  className?: string;
}

const FavoriteButton = ({ eventId, isFavorite, onToggle, className = "" }: FavoriteButtonProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      if (isFavorite) {
        await removeFavorite(eventId);
        if (onToggle) onToggle(false);
      } else {
        await addFavorite(eventId);
        if (onToggle) onToggle(true);
      }
    } catch (err) {
      console.error("Error toggling favorite status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center justify-center p-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-50 cursor-pointer ${className}`}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-all duration-200 ${
          isFavorite
            ? "fill-rose-500 stroke-rose-500 drop-shadow-sm"
            : "fill-transparent stroke-slate-500 hover:stroke-rose-500"
        }`}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
};

export default FavoriteButton;