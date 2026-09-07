import { useState } from "react";
import { Link } from "react-router";
import { Calendar, MapPin, Users, Tag, RotateCw, RotateCcw, ArrowRight } from "lucide-react";
import type { Event } from "../interfaces/event.interface";
import FavoriteButton from "./FavoriteButton";
import { formatPrice, formatDate } from "../utils";

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
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const imageUrl =
    event.images && event.images.length > 0
      ? typeof event.images[0] === "string"
        ? event.images[0]
        : (event.images[0] as any).url
      : null;

  return (
    <div className="w-full [perspective:1000px] h-[410px]">
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* ==================== FRENTE DE LA TARJETA (FULL-BLEED POSTER) ==================== */}
        <div
          onClick={() => setIsFlipped(true)}
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-200/60 transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
            isFlipped ? "pointer-events-none select-none z-0" : "pointer-events-auto z-10"
          }`}
        >
          {/* Imagen de fondo que cubre el 100% de la tarjeta */}
          <div className="absolute inset-0 w-full h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={event.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x800/0f172a/2563eb?text=PlanCity";
                }}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-slate-800 to-slate-950 flex items-center justify-center text-slate-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
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
              </div>
            )}

            {/* Sombreado degradado suave para legibilidad perfecta del título */}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10 pointer-events-none" />
          </div>

          {/* Botón de Favoritos (Esquina superior izquierda) */}
          {showFavoriteButton && (
            <div
              className="absolute top-3.5 left-3.5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <FavoriteButton
                eventId={event.id}
                isFavorite={isFavorite}
                onToggle={onFavoriteToggle}
              />
            </div>
          )}

          {/* Indicador flotante "Voltear" (Esquina superior derecha) */}
          <div className="absolute top-3.5 right-3.5 z-10 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm transition-transform group-hover:scale-105">
            <span>Voltear</span>
            <RotateCw className="h-3 w-3" />
          </div>

          {/* Único contenido en la parte inferior del frente: TÍTULO DEL EVENTO */}
          <div className="absolute bottom-0 inset-x-0 p-5 z-10">
            <h3 className="font-extrabold text-white text-lg md:text-xl tracking-tight leading-snug drop-shadow-md line-clamp-2 group-hover:text-blue-200 transition-colors">
              {event.name}
            </h3>
            <p className="text-[11px] text-slate-300 font-medium mt-1.5 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Toca para ver detalles</span>
              <RotateCw className="h-3 w-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* ==================== REVERSO DE LA TARJETA (3D FLIP) ==================== */}
        <div
          className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between text-white ${
            isFlipped ? "pointer-events-auto z-20" : "pointer-events-none select-none z-0"
          }`}
        >
          <div>
            {/* Barra superior de control del reverso */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300 bg-blue-900/40 border border-blue-500/30 px-2.5 py-0.5 rounded-md">
                {event.category?.name || "Detalles"}
              </span>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Volver</span>
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Título */}
            <h3 className="font-bold text-white text-base line-clamp-1 leading-snug">
              {event.name}
            </h3>

            {/* Descripción truncada */}
            <p className="text-slate-300 text-xs mt-2 line-clamp-3 leading-relaxed">
              {event.description || "Sin descripción adicional disponible para este evento."}
            </p>

            {/* Ficha técnica con iconos Lucide alineados perfectamente en una sola línea */}
            <div className="mt-4 space-y-2.5 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              
              {/* Fecha */}
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  <Calendar className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Fecha:</span>
                </span>
                <span className="font-semibold text-white text-right truncate">
                  {formatDate(event.date, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>

              {/* Ubicación */}
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Ubicación:</span>
                </span>
                <span className="font-semibold text-white text-right truncate max-w-[140px]">
                  {event.location}
                </span>
              </div>

              {/* Capacidad */}
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  <Users className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Capacidad:</span>
                </span>
                <span className="font-semibold text-white text-right">
                  {event.capacity} personas
                </span>
              </div>

              {/* Precio */}
              <div className="flex items-center justify-between gap-3 text-slate-300 border-t border-slate-800 pt-2">
                <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  <Tag className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Precio:</span>
                </span>
                <span className="font-extrabold text-sky-400 font-heading text-sm text-right">
                  {formatPrice(event.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Botón de acción principal al pie del reverso con navegación Link directa */}
          <div className="pt-3 border-t border-slate-800">
            <Link
              to={`/events/${event.id}`}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Ver detalle completo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
