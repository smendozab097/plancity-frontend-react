import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAllEvents } from "../services/event.service";
import type { Event } from "../interfaces/event.interface";
import { formatPrice } from "../utils";

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);

  // Estado para eventos destacados
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar parámetro de logout exitoso
  useEffect(() => {
    if (searchParams.get("logout") === "success") {
      setShowLogoutAlert(true);
      // Limpiar el parámetro de la URL silenciosamente
      searchParams.delete("logout");
      setSearchParams(searchParams, { replace: true });

      // Auto-ocultar el Toast después de 5 segundos
      const timer = setTimeout(() => {
        setShowLogoutAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  // Cargar únicamente los 4 eventos más recientes para la sección "Destacados" (sin paginación en la API)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await getAllEvents();
        
        // Dado que la API no tiene paginación, recibimos el arreglo completo. 
        // Realizamos el limitador (slicing) en el cliente para pintar solo los primeros 4.
        setFeaturedEvents(response.slice(0, 4));
      } catch (err: any) {
        console.error("Error loading featured events:", err);
        setError(err.friendlyMessage || "No se pudieron cargar los eventos destacados.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center py-10 px-4 md:px-8 relative">
      {/* Toast flotante de cierre de sesión */}
      {showLogoutAlert && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce border border-slate-800">
          <div className="bg-emerald-500 text-slate-950 p-1 rounded-full shrink-0">
            <svg xmlns="http://www.w3.org/2500/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">¡Sesión cerrada con éxito!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full max-w-5xl bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center gap-6 mt-6">
        <div className="bg-blue-50 text-blue-600 text-xs font-black uppercase px-4 py-1.5 rounded-full tracking-wider border border-blue-100">
          Bienvenido a tu agenda virtual de eventos
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight max-w-2xl">
          Gestiona Eventos con facilidad
        </h1>
        <p className="text-slate-500 max-w-xl text-base md:text-lg leading-relaxed font-medium">
          Una plataforma rápida y moderna para gestionar eventos, categorías de eventos y configurar tus favoritos.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            to="/events"
            className="bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 px-6 rounded-2xl tracking-wide transition-all hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-slate-900/10 cursor-pointer"
          >
            Explorar Catálogo
          </Link>
          {user ? (
            <div className="text-slate-650 font-bold px-4 py-3 bg-slate-100 rounded-2xl border border-slate-200/60 text-sm">
              Bienvenido, <span className="text-slate-800 font-extrabold">{user.name}</span> ({user.role})
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white hover:bg-slate-50 text-slate-750 font-bold py-3.5 px-6 rounded-2xl tracking-wide border border-slate-250 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </section>

      {/* Sección de eventos Destacados */}
      <section className="w-full max-w-5xl mt-16">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Eventos Recientes</h2>
            <p className="text-slate-500 text-sm mt-0.5 leading-relaxed font-medium">Últimas novedades agregadas al inventario.</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 group"
          >
            Ver todo
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mb-3"></div>
            <p className="text-slate-400 text-sm font-medium">Cargando destacados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-semibold text-sm">{error}</p>
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200/60 rounded-2xl">
            <p className="text-slate-400 font-semibold text-sm">No hay eventos disponibles por el momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredEvents.map((event) => {
              const imageUrl = event.images && event.images.length > 0 
                ? (typeof event.images[0] === "string" ? event.images[0] : (event.images[0] as any).url) 
                : null;

              return (
                <div
                  key={event.id}
                  className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all flex flex-col justify-between h-full group relative"
                >
                  <div>
                    {/* Imagen */}
                    <div className="aspect-square w-full bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={event.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                        {event.category?.name || "General"}
                      </span>
                      <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                        {event.name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {event.description || "Sin descripción adicional."}
                      </p>
                    </div>
                  </div>

                  {/* Detalle */}
                  <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-base font-black text-slate-850">{formatPrice(event.price)}</span>
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
      </section>
    </main>
  );
};

export default Home;