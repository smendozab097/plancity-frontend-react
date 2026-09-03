import { Link } from "react-router";
import type { Event } from "../interfaces/event.interface";
import FavoriteButton from "./FavoriteButton";
import { formatPrice } from "../utils";

interface EventCardProps {
  event: Event;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFav: boolean) => void;
  showFavoriteButton?: boolean;
}

const EventCard = ({
  event,
  isFavorite = false,
  onFavoriteToggle,
  showFavoriteButton = true,
}: EventCardProps) => {
  const imageUrl =
    event.images && event.images.length > 0
      ? typeof event.images[0] === "string"
        ? event.images[0]
        : (event.images[0] as any).url
      : null;

  return (
    <div className="group bg-white border border-slate-200/70 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-100/80 hover:border-slate-300/80 transition-all duration-200 flex flex-col justify-between h-full relative">
      {/* Botón Flotante de Favoritos */}
      {showFavoriteButton && (
        <div className="absolute top-3.5 left-3.5 z-10">
          <FavoriteButton
            eventId={event.id}
            isFavorite={isFavorite}
            onToggle={onFavoriteToggle}
          />
        </div>
      )}

      <div>
        {/* Imagen del Evento */}
        <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/600x400/f1f5f9/94a3b8?text=Sin+Imagen";
              }}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>

        {/* Cuerpo de la Tarjeta */}
        <div className="p-5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">
            {event.category?.name || "General"}
          </span>
          <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
            {event.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {event.description || "Sin descripción adicional."}
          </p>
        </div>
      </div>

      {/* Pie de Tarjeta */}
      <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between mt-auto">
        <span className="text-base font-black text-slate-800">
          {formatPrice(event.price)}
        </span>
        <Link
          to={`/events/${event.id}`}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
