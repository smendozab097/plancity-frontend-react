import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getAllEvents } from "../services/event.service";
import { getAllCategories } from "../services/category.service";
import { getAllFavorites } from "../services/favorite.service";
import type { Event } from "../interfaces/event.interface";
import type { Category } from "../interfaces/category.interface";
import EventCard from "../components/EventCard";
import FeaturedCarousel from "../components/FeaturedCarousel";

const Home = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);

  // Estados de datos
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar parámetro de logout exitoso
  useEffect(() => {
    if (searchParams.get("logout") === "success") {
      setShowLogoutAlert(true);
      searchParams.delete("logout");
      setSearchParams(searchParams, { replace: true });

      const timer = setTimeout(() => {
        setShowLogoutAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, setSearchParams]);

  // Cargar favoritos del usuario si está logueado
  useEffect(() => {
    const fetchFavs = async () => {
      if (!user) {
        setFavoriteIds([]);
        return;
      }
      try {
        const favs = await getAllFavorites();
        setFavoriteIds(favs.map((f) => f.id));
      } catch (err) {
        console.error("Error fetching favorites in home:", err);
      }
    };
    fetchFavs();
  }, [user]);

  // Cargar categorías y eventos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, categoriesData] = await Promise.all([
          getAllEvents(),
          getAllCategories(),
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error("Error loading home data:", err);
        setError(err.friendlyMessage || "No se pudieron cargar los datos de la página principal.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Eventos destacados para el carrusel (ordenados por mayor capacidad)
  const carouselEvents = [...events]
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
    .slice(0, 5);

  // Filtrado de eventos para la grilla por píldora de categoría
  const filteredEvents = selectedCategory
    ? events.filter((e) => e.categoryId === selectedCategory)
    : events;

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center py-8 px-4 md:px-8 relative overflow-hidden">
      
      {/* Toast flotante de cierre de sesión */}
      {showLogoutAlert && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-500/40">
          <div className="bg-emerald-500 text-slate-950 p-1 rounded-full shrink-0 shadow-xs shadow-emerald-400/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide">¡Sesión cerrada con éxito!</span>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-10">
        
        {/* CARRUSEL HERO DE EVENTOS CON MAYOR CAPACIDAD */}
        <section className="w-full">
          <FeaturedCarousel events={carouselEvents} />
        </section>

        {/* BIENVENIDA CONCISA Y BOTONES DE ACCIÓN */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase px-3 py-1 rounded-full border border-blue-200 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Agenda Urbana y Cultural</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Descubre qué hacer en tu ciudad
            </h1>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">
              Explora conciertos, talleres, picnics y eventos al aire libre. Haz clic en cualquier tarjeta para voltearla y ver los detalles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/events"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3 px-6 rounded-xl tracking-wide transition-all shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Explorar Catálogo Completo
            </Link>
            {!user ? (
              <Link
                to="/login"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-3 px-5 rounded-xl border border-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Iniciar Sesión
              </Link>
            ) : (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-4 py-3 rounded-xl border border-slate-200">
                ¡Hola, <strong className="text-slate-900">{user.name}</strong>!
              </span>
            )}
          </div>
        </section>

        {/* SECCIÓN DE CATEGORÍAS (TOPICS PILLS - MEN'S HEALTH WEEK STYLE) */}
        <section className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
              Explorar por Temáticas
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-1">
              Filtra los eventos según tus intereses preferidos
            </p>
          </div>

          {/* Barra horizontal de píldoras centradas */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                selectedCategory === ""
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              Todos los eventos ({events.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat.name}
              </button>
            ))}

            {selectedCategory && (
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>✕ Restablecer</span>
              </button>
            )}
          </div>
        </section>

        {/* GRILLA DE TARJETAS 3D FLIP CARDS */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-slate-900 font-heading">
              {selectedCategory
                ? `Eventos en "${categories.find((c) => c.id === selectedCategory)?.name}"`
                : "Eventos Disponibles"}
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              {filteredEvents.length} resultados
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent mb-3"></div>
              <p className="text-slate-600 text-sm font-medium">Cargando eventos...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-md mx-auto">
              <p className="font-semibold text-sm">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-md mx-auto">
              <p className="text-slate-700 font-bold text-base">No hay eventos en esta categoría</p>
              <p className="text-slate-500 text-xs mt-1">Prueba seleccionando otra temática o restablece el filtro.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="mt-4 text-xs font-bold text-blue-600 hover:underline"
              >
                Ver todos los eventos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
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
        </section>

      </div>
    </main>
  );
};

export default Home;