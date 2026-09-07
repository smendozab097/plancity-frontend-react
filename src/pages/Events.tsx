import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAllEvents } from "../services/event.service";
import { getAllCategories } from "../services/category.service";
import { getAllFavorites } from "../services/favorite.service";
import EventCard from "../components/EventCard";
import FeaturedCarousel from "../components/FeaturedCarousel";
import type { Event } from "../interfaces/event.interface";
import type { Category } from "../interfaces/category.interface";

const Events = () => {
  const { user } = useAuth();

  // Estados para favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Estados de catálogo de eventos
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]); // Para el carrusel superior
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerError, setTriggerError] = useState<boolean>(false);

  // Estados de filtros y búsqueda
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Cargar los favoritos del usuario
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavoriteIds([]);
        return;
      }
      try {
        const favs = await getAllFavorites();
        setFavoriteIds(favs.map((f) => f.id));
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };
    fetchFavorites();
  }, [user]);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await getAllCategories();
        setCategories(catData);
      } catch (err) {
        console.error("Error loading categories in catalog:", err);
      }
    };
    fetchCategories();
  }, []);

  // Cargar todos los eventos una vez para el carrusel compacto superior
  useEffect(() => {
    const fetchAllForCarousel = async () => {
      try {
        const res = await getAllEvents();
        setAllEvents(res);
      } catch (e) {
        console.error("Error fetching events for carousel:", e);
      }
    };
    fetchAllForCarousel();
  }, []);

  // Cargar eventos filtrados cada vez que cambien search o categoryId
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = {
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(categoryId ? { categoryId } : {}),
        };

        const response = await getAllEvents(queryParams);
        setEvents(response);
      } catch (err: any) {
        console.error("Error fetching events in catalog:", err);
        setError(err.friendlyMessage || "No se pudieron cargar los eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryId, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (triggerError) {
    throw new Error("Fallo de renderizado simulado intencionalmente para evaluar el Error Boundary.");
  }

  // Eventos para el carrusel compacto (top 4 de capacidad)
  const carouselEvents = [...allEvents]
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      
      {/* CARRUSEL COMPACTO DE TENDENCIAS EN LA VISTA DE EVENTOS */}
      {carouselEvents.length > 0 && (
        <section className="w-full">
          <FeaturedCarousel events={carouselEvents} compact={true} />
        </section>
      )}

      {/* ENCABEZADO CON BUSCADOR Y ACCIÓN DE ADMIN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Catálogo de <span className="text-blue-600">Eventos</span>
          </h1>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            Explora las actividades programadas en tu ciudad. Haz clic en las tarjetas para descubrir toda la información.
          </p>
        </div>

        {user?.role === "admin" && (
          <Link
            to="/events/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl tracking-wide transition-all shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Evento
          </Link>
        )}
      </div>

      {/* BARRA DE BÚSQUEDA Y PÍLDORAS DE CATEGORÍAS (TOPICS PILLS) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        
        {/* Input de búsqueda rápida */}
        <div className="relative max-w-xl mx-auto">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            id="search-input"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar evento por nombre (ej: Concierto, Picnic, Danza)..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-900 placeholder-slate-400 pl-10 pr-10 py-3 rounded-xl text-sm font-medium transition-all outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Píldoras de categoría (Estilo Men's Health Week Topics) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              categoryId === ""
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105"
                : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            Todas ({allEvents.length || events.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                categoryId === cat.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {(categoryId || search) && (
            <button
              type="button"
              onClick={() => {
                setCategoryId("");
                setSearch("");
              }}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>✕ Limpiar filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* RESULTADOS Y CONTADOR */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
          {categoryId
            ? `Eventos en "${categories.find((c) => c.id === categoryId)?.name}"`
            : "Todos los Eventos"}
        </h2>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          {loading ? "Buscando..." : `${events.length} encontrados`}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-medium">Obteniendo catálogo...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl max-w-md mx-auto px-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-1 text-slate-900">No se encontraron eventos</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            No hay eventos que coincidan con la búsqueda o la categoría seleccionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite={favoriteIds.includes(event.id)}
              onFavoriteToggle={(isFav) => {
                if (isFav) {
                  setFavoriteIds((prev) => [...prev, event.id]);
                } else {
                  setFavoriteIds((prev) => prev.filter((id) => id !== event.id));
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Botón discreto para simulación de errores */}
      <div className="mt-16 text-center border-t border-slate-200 pt-8">
        <button
          type="button"
          onClick={() => setTriggerError(true)}
          className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors border border-dashed border-slate-300 hover:border-red-300 rounded-xl px-4 py-2 bg-white cursor-pointer"
        >
          🚨 Simular Fallo de Renderizado (Probar Error Boundary)
        </button>
      </div>
    </div>
  );
};

export default Events;