import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getCategoryById } from "../services/category.service";
import { getAllEvents } from "../services/event.service";
import type { Category } from "../interfaces/category.interface";
import type { Event } from "../interfaces/event.interface";
import FavoriteButton from "../components/FavoriteButton";
import { formatPrice } from "../utils";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Estado para guardar favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Estados locales
  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndEvents = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // 1. Obtener información de la categoría
        const categoryData = await getCategoryById(id);
        setCategory(categoryData);

        // 2. Obtener lista de eventos que pertenecen a la categoría
        const eventsResponse = await getAllEvents({ categoryId: id });
        setEvents(eventsResponse);
      } catch (err: any) {
        console.error("Error loading category detail:", err);
        setErrorMsg(err.friendlyMessage || "No se pudo cargar el detalle de la categoría.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndEvents();
  }, [id]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Botón de retroceso */}
      <Link
        to="/categories"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-6 transition-colors group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a Categorías
      </Link>

      {/* Cargando */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : errorMsg || !category ? (
        // Error
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-700 text-sm font-semibold">{errorMsg || "Categoría no encontrada."}</span>
        </div>
      ) : (
        // Contenido Principal
        <div>
          {/* Encabezado de la Categoría */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Detalle de Categoría</span>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-1">{category.name}</h1>
              <p className="text-slate-500 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                {category.description || "Esta categoría no posee una descripción cargada en el sistema."}
              </p>
            </div>
            
            {/* Botón visible solo para usuarios Autenticados (Admin rol) */}
            {user?.role === "admin" && (
              <Link
                to={`/events/new?categoryId=${category.id}`}
                className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3.5 rounded-2xl tracking-wide transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Agregar evento a esta categoría
              </Link>
            )}
          </div>

          {/* Listado de Eventos de la Categoría */}
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Eventos Relacionados</h2>
          
          {events.length === 0 ? (
            // Lista vacía
            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-bold text-slate-700">Sin eventos</h3>
              <p className="text-slate-500 text-sm mt-1">Aún no se han registrado eventos asociados a esta categoría.</p>
            </div>
          ) : (
            // Grid de eventos
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;