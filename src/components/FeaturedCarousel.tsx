import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Sparkles, Users, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Event } from "../interfaces/event.interface";
import { formatDate, formatPrice } from "../utils";

interface FeaturedCarouselProps {
  events: Event[];
  compact?: boolean;
}

const FeaturedCarousel = ({ events, compact = false }: FeaturedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-play cada 5 segundos si no está en pausa
  useEffect(() => {
    if (events.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length, isPaused]);

  if (!events || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];
  const imageUrl =
    currentEvent.images && currentEvent.images.length > 0
      ? typeof currentEvent.images[0] === "string"
        ? currentEvent.images[0]
        : (currentEvent.images[0] as any).url
      : null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl shadow-xl border border-slate-200/80 bg-slate-900 group ${
        compact ? "h-72 md:h-80" : "h-96 md:h-[440px]"
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Imagen de fondo con gradiente de contraste */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={currentEvent.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/1200x600/0f172a/2563eb?text=PlanCity+Destacado";
            }}
          />
        ) : (
          <div className="w-full h-full bg-linear-to-tr from-slate-900 via-blue-950 to-slate-800" />
        )}
        {/* Capa de oscurecimiento degradada */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/50 to-slate-950/20" />
      </div>

      {/* Contenido principal del slide */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 bg-blue-600/30 backdrop-blur-md border border-blue-400/40 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{currentEvent.category?.name || "Destacado"}</span>
          </span>
          <span className="text-xs font-semibold text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span>Capacidad: {currentEvent.capacity} personas</span>
          </span>
          <span className="text-xs font-semibold text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            <span>{currentEvent.location}</span>
          </span>
        </div>

        <h2
          className={`font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md font-heading ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl lg:text-5xl"
          }`}
        >
          {currentEvent.name}
        </h2>

        <p className="text-slate-300 text-xs md:text-sm line-clamp-2 max-w-2xl mb-5 leading-relaxed font-normal">
          {currentEvent.description || "Descubre todos los detalles y actividades de este evento en PlanCity."}
        </p>

        <div className="flex items-center gap-4">
          <span className="text-xl md:text-2xl font-black text-white font-heading">
            {formatPrice(currentEvent.price)}
          </span>
          <Link
            to={`/events/${currentEvent.id}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Ver evento</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Fecha: {formatDate(currentEvent.date)}</span>
          </span>
        </div>
      </div>

      {/* Botones de navegación (Prev / Next) */}
      {events.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Anterior evento"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 hover:opacity-100"
            aria-label="Siguiente evento"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots indicadores */}
          <div className="absolute bottom-4 right-6 md:right-10 z-20 flex items-center gap-2">
            {events.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx
                    ? "w-8 bg-blue-500"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedCarousel;
