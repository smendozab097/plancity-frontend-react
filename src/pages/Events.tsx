import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAllEvents } from "../services/event.service";
import { getAllCategories } from "../services/category.service";
import { getAllFavorites } from "../services/favorite.service";
import FavoriteButton from "../components/FavoriteButton";
import type { Event } from "../interfaces/event.interface";
import type { Category } from "../interfaces/category.interface";
import { formatPrice } from "../utils";

const Events = () => {
  const { user } = useAuth();

  // Estado para guardar favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Estados de catálogo de eventos
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerError, setTriggerError] = useState<boolean>(false);

  // Estados de filtros y búsqueda 
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  // Cargar los favoritos del usuario al iniciar sesión o cambiar
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

  // Cargar categorías al montar el componente
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

  // Cargar eventos cada vez que cambien los filtros o la búsqueda 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir la consulta
        const queryParams = {
          ...(search.trim() ? { search: search.trim() } : {}),
          ...(categoryId ? { categoryId } : {}),
        };

        const response = await getAllEvents(queryParams);
        
        // Asignamos la respuesta directamente, ya que es un arreglo plano de eventos
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

  // Manejar el cambio de filtros
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (triggerError) {
    throw new Error("Fallo de renderizado simulado intencionalmente para evaluar el Error Boundary.");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Catálogo de Eventos</h1>
          <p className="text-slate-500 mt-1 leading-relaxed">
            Busca, filtra y explora todos los eventos disponibles en nuestra Agenda.
          </p>
        </div>
        
        {/* Botón visible para cualquier usuario autenticado */}
        {user?.role === "admin" && (
          <Link
            to="/events/new"
            className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 py-3.5 rounded-2xl tracking-wide transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] shrink-0"
          >
            <svg xmlns="http://www.w3.org/2050/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Evento
          </Link>
        )}
      </div>

      {/* Controles de Búsqueda y Filtros - Reorganizado a 3 columnas */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Buscador */}
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="search-input" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Buscar por nombre
          </label>
          <div className="relative">
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
              placeholder="Ej: Picnic, Concierto..."
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 pl-10 pr-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
            />
          </div>
        </div>

        {/* Filtro por Categorías */}
        <div className="space-y-1.5">
          <label htmlFor="category-select" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Categoría
          </label>
          <select
            id="category-select"
            value={categoryId}
            onChange={handleCategoryChange}
            className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-850 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados - Lee directamente la cantidad desde el arreglo local */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200/60 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-800">Eventos</h2>
        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200/60">
          {loading ? "Buscando..." : `${events.length} eventos encontrados`}
        </span>
      </div>

      {loading ? (
        // Spinner
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-slate-500 font-medium">Obteniendo catálogo...</p>
        </div>
      ) : error ? (
        // Error
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-3xl text-center max-w-xl mx-auto shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold">{error}</p>
        </div>
      ) : events.length === 0 ? (
        // Lista vacía
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl max-w-md mx-auto px-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-1 text-slate-800">No se encontraron eventos</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            No hay eventos registrados que coincidan con la búsqueda o la categoría seleccionada.
          </p>
        </div>
      ) : (
        // Grid de eventos (sin sección ni controles de paginación)
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event) => {
              const imageUrl = event.images && event.images.length > 0 
                ? (typeof event.images[0] === "string" ? event.images[0] : (event.images[0] as any).url) 
                : null;

              return (
                <div 
                  key={event.id} 
                  className="group bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-100/80 hover:border-slate-300/80 transition-all flex flex-col h-full relative"
                >
                  {/* Botón Flotante de Favoritos */}
                  <div className="absolute top-4 left-4 z-10">
                    <FavoriteButton
                      eventId={event.id}
                      isFavorite={favoriteIds.includes(event.id)}
                      onToggle={(isFav) => {
                        if (isFav) {
                          setFavoriteIds((prev) => [...prev, event.id]);
                        } else {
                          setFavoriteIds((prev) => prev.filter((id) => id !== event.id));
                        }
                      }}
                    />
                  </div>

                  {/* Imagen del evento */}
                  <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={event.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Cuerpo de la Tarjeta */}
                  <div className="p-5 grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {event.name}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {event.category?.name || "General"}
                      </p>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {event.description || "Sin descripción disponible."}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-lg font-black text-slate-850">{formatPrice(event.price)}</span>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón discreto para simulación de errores en el simulacro */}
      <div className="mt-16 text-center border-t border-slate-200/40 pt-8">
        <button
          type="button"
          onClick={() => setTriggerError(true)}
          className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors border border-dashed border-slate-200 hover:border-red-200 rounded-xl px-4 py-2 bg-white cursor-pointer"
        >
          🚨 Simular Fallo de Renderizado (Probar Error Boundary)
        </button>
      </div>
    </div>
  );
};

export default Events;