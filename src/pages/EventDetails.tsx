import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import {
  MapPin,
  Users,
  Calendar,
  Tag,
  ArrowLeft,
  Share2,
  Check,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEventById, deleteEvent } from "../services/event.service";
import { getAllFavorites } from "../services/favorite.service";
import FavoriteButton from "../components/FavoriteButton";
import type { Event } from "../interfaces/event.interface";
import { formatDate, isEventExpired, formatPrice } from "../utils";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados locales
  const [event, setEvent] = useState<Event | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Cargar información del evento
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        if (data.images && data.images.length > 0) {
          const firstImg =
            typeof data.images[0] === "string"
              ? data.images[0]
              : (data.images[0] as any).url;
          setActiveImage(firstImg);
        }

        // Verificar si es favorito del usuario
        if (user) {
          try {
            const favs = await getAllFavorites();
            setIsFavorite(favs.some((f) => f.id === data.id));
          } catch (err) {
            console.error("Error loading favorites status in detail:", err);
          }
        }
      } catch (err: any) {
        console.error("Error loading event detail:", err);
        setErrorMsg(
          err.friendlyMessage || "No se pudo cargar el detalle del evento."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  // Copiar enlace al portapapeles
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Acción para eliminar eventos
  const handleDelete = async () => {
    if (!id) return;
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este evento permanentemente?"
    );
    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await deleteEvent(id);
      navigate("/events"); // Redirigir al catálogo de eventos
    } catch (err: any) {
      console.error("Error deleting event:", err);
      alert(
        err.friendlyMessage ||
          "Ocurrió un error al intentar eliminar el evento."
      );
    } finally {
      setDeleting(false);
    }
  };

  const expired = event ? isEventExpired(event.date) : false;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra superior de Navegación & Acciones rápidas */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-full border border-slate-200/90 shadow-xs hover:shadow-md group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a eventos</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Botón Compartir */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-4 py-2.5 rounded-full border border-slate-200/90 shadow-xs transition-all cursor-pointer"
              title="Copiar enlace del evento"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Compartir</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Estado de Carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-500">
              Cargando los detalles del evento...
            </p>
          </div>
        ) : errorMsg || !event ? (
          <div className="max-w-2xl mx-auto p-8 bg-white border border-red-200 rounded-3xl shadow-lg text-center space-y-4">
            <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-2xl">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Evento no encontrado
            </h2>
            <p className="text-slate-600 text-sm">
              {errorMsg ||
                "El evento que estás buscando no existe o fue retirado de la plataforma."}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              Explorar otros eventos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ========================================================
                COLUMNA IZQUIERDA: SHOWCASE VISUAL Y DESCRIPCIÓN EXTENSA
                ======================================================== */}
            <div className="lg:col-span-7 space-y-8">
              {/* Contenedor Principal de la Imagen */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xl group">
                <div className="aspect-4/3 md:aspect-16/10 w-full relative overflow-hidden bg-slate-950">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/800x500/0f172a/2563eb?text=PlanCity";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Sparkles className="h-10 w-10 text-slate-600" />
                      <span className="font-medium text-sm">
                        Sin imagen disponible
                      </span>
                    </div>
                  )}

                  {/* Sombreado degradado para legibilidad */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Badges Flotantes Superiores */}
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-md border shadow-sm ${
                        expired
                          ? "bg-red-500/90 text-white border-red-400/40"
                          : "bg-emerald-600/90 text-white border-emerald-400/40"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          expired ? "bg-white" : "bg-emerald-200 animate-pulse"
                        }`}
                      />
                      {expired ? "Evento Finalizado" : "Evento Confirmado"}
                    </span>

                    <div className="pointer-events-auto">
                      <FavoriteButton
                        eventId={event.id}
                        isFavorite={isFavorite}
                        onToggle={(isFav) => {
                          if (!user) {
                            navigate("/login", { state: { from: location } });
                            alert(
                              "¡Debes iniciar sesión para guardar favoritos!"
                            );
                            return;
                          }
                          setIsFavorite(isFav);
                        }}
                      />
                    </div>
                  </div>

                  {/* Badge de Categoría inferior en la foto */}
                  {event.category && (
                    <div className="absolute bottom-4 left-4 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 bg-blue-600/90 backdrop-blur-md text-white font-bold text-xs px-3 py-1 rounded-lg border border-blue-400/30 shadow-sm">
                        <Tag className="h-3 w-3" />
                        {event.category.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Galería de Miniaturas (si hay más de 1 imagen) */}
                {event.images && event.images.length > 1 && (
                  <div className="p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex gap-2.5 overflow-x-auto">
                    {event.images.map((img, idx) => {
                      const imgUrl =
                        typeof img === "string" ? img : (img as any).url;
                      const isActive = activeImage === imgUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImage(imgUrl)}
                          className={`h-16 w-20 rounded-xl overflow-hidden shrink-0 transition-all border-2 cursor-pointer relative ${
                            isActive
                              ? "border-blue-500 scale-105 shadow-md shadow-blue-500/30"
                              : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tarjeta de Descripción y Resumen */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-blue-600 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Acerca de esta experiencia</span>
                  </h2>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight">
                    {event.name}
                  </h3>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
                    {event.description ||
                      "No hay una descripción detallada registrada para este evento. Asiste y disfruta de una experiencia única en la ciudad."}
                  </p>
                </div>

                {/* Banner de Garantías PlanCity */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                    <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Aforo Garantizado
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Capacidad oficial para {event.capacity} asistentes sin sobrecupo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <Clock className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Puntualidad Urbana
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Apertura de puertas 30 minutos antes del inicio.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                COLUMNA DERECHA: TARJETA FLOTANTE DE INFORMACIÓN & COMPRA
                ======================================================== */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                
                {/* Header de Precios */}
                <div className="border-b border-slate-100 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Precio de entrada
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                      {formatPrice(event.price)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / persona
                    </span>
                  </div>
                  {event.price === 0 && (
                    <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      ¡Entrada Gratuita!
                    </span>
                  )}
                </div>

                {/* Ficha Técnica Detallada */}
                <div className="space-y-4">
                  {/* Fecha */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Fecha del evento
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm capitalize">
                        {formatDate(event.date, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Ubicación */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="grow min-w-0">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Lugar del evento
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm truncate">
                        {event.location}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          event.location
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-1 hover:underline cursor-pointer"
                      >
                        <span>Ver en Google Maps</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Capacidad */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Capacidad de aforo
                      </span>
                      <p className="font-extrabold text-slate-900 text-sm">
                        {event.capacity} personas
                      </p>
                    </div>
                  </div>

                  {/* Categoría */}
                  {event.category && (
                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                        <Tag className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Categoría
                        </span>
                        <p className="font-extrabold text-slate-900 text-sm">
                          {event.category.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones para Administradores */}
                {user?.role === "admin" && (
                  <div className="pt-5 border-t border-slate-100 space-y-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block text-center">
                      Gestión de Administrador
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        to={`/events/edit/${event.id}`}
                        className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Editar</span>
                      </Link>

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs border border-red-200 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {deleting ? (
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Eliminar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;