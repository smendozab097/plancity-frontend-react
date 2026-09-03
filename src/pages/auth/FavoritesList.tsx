import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getAllFavorites } from "../../services/favorite.service";
import type { Event } from "../../interfaces/event.interface";
import EventCard from "../../components/EventCard";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cargar favoritos al montar
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getAllFavorites();
        setFavorites(data);
      } catch (err: any) {
        console.error("Error loading favorites page:", err);
        setErrorMsg(err.friendlyMessage || "No se pudieron cargar tus favoritos.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-805 tracking-tight font-heading">Mis Favoritos</h1>
        <p className="text-slate-500 mt-1 leading-relaxed">
          Aquí encontrarás todos los eventos que has marcado como tus preferidos.
        </p>
      </div>

      {loading ? (
        // Cargando
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : errorMsg ? (
        // Error
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-700 text-sm font-semibold">{errorMsg}</span>
        </div>
      ) : favorites.length === 0 ? (
        // Lista vacía
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
          <div className="h-16 w-16 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-transparent stroke-red-500" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">Aún no tienes favoritos</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Navega por nuestra plataforma y haz clic en el corazón de los eventos que te encanten.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl tracking-wide transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            Explorar Eventos
          </Link>
        </div>
      ) : (
        // Grid de favoritos
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite={true}
              onFavoriteToggle={(isFav) => {
                if (!isFav) {
                  setFavorites((prev) => prev.filter((p) => p.id !== event.id));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;