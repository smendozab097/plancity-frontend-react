import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Tag,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  Sparkles,
  AlertCircle,
  CalendarX,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service";
import { getAllEvents } from "../services/event.service";
import { getAllFavorites } from "../services/favorite.service";
import type { Category } from "../interfaces/category.interface";
import type { Event } from "../interfaces/event.interface";
import EventCard from "../components/EventCard";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estado para guardar favoritos del usuario
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Estados locales
  const [category, setCategory] = useState<Category | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados para Edición y Eliminación de Categoría
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleStartEdit = () => {
    if (category) {
      setEditName(category.name);
      setEditDescription(category.description || "");
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !editName.trim()) return;
    setSavingEdit(true);
    try {
      const updated = await updateCategory(id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });
      setCategory(updated);
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error al actualizar categoría:", err);
      alert(err.friendlyMessage || "No se pudo actualizar la categoría.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (events.length > 0) {
      alert(
        `No se puede eliminar la categoría porque tiene ${events.length} evento(s) asignado(s).`
      );
      return;
    }

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar permanentemente la categoría "${category?.name}"?`
    );
    if (!confirmDelete || !id) return;

    try {
      setDeleting(true);
      await deleteCategory(id);
      navigate("/categories");
    } catch (err: any) {
      console.error("Error al eliminar categoría:", err);
      alert(
        err.friendlyMessage || "Ocurrió un error al intentar eliminar la categoría."
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchCategoryAndEvents = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [categoryData, eventsResponse] = await Promise.all([
          getCategoryById(id),
          getAllEvents({ categoryId: id }),
        ]);

        setCategory(categoryData);
        setEvents(eventsResponse);

        // Cargar favoritos si el usuario está autenticado
        if (user) {
          try {
            const favs = await getAllFavorites();
            setFavoriteIds(favs.map((f) => f.id));
          } catch (favErr) {
            console.error("Error al obtener favoritos:", favErr);
          }
        }
      } catch (err: any) {
        console.error("Error loading category detail:", err);
        setErrorMsg(
          err.friendlyMessage || "No se pudo cargar el detalle de la categoría."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndEvents();
  }, [id, user]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            BARRA SUPERIOR: RETORNO Y BREADCRUMB
            ======================================================== */}
        <div className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2.5 rounded-full border border-slate-200/90 shadow-xs hover:shadow-md group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Categorías</span>
          </Link>
        </div>

        {/* Estado de Carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-500">
              Cargando información de la categoría...
            </p>
          </div>
        ) : errorMsg || !category ? (
          <div className="max-w-2xl mx-auto p-8 bg-white border border-red-200 rounded-3xl shadow-lg text-center space-y-4">
            <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-2xl">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Categoría no encontrada
            </h2>
            <p className="text-slate-600 text-sm">
              {errorMsg ||
                "La categoría seleccionada no existe o fue retirada del sistema."}
            </p>
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              Explorar otras categorías
            </Link>
          </div>
        ) : (
          <div>
            {/* ========================================================
                HERO SHOWCASE DE LA CATEGORÍA
                ======================================================== */}
            <div className="relative overflow-hidden bg-[#0f172a] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12 text-white">
              {/* Resplandor decorativo de fondo */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

              {isEditing ? (
                /* Formulario de Edición Integrado */
                <form onSubmit={handleSaveEdit} className="relative z-10 space-y-5 max-w-2xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                      <Edit3 className="h-3.5 w-3.5" />
                      Modo de Edición de Categoría
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancelar</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Nombre de la Categoría
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 text-white px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                      placeholder="Nombre de la categoría"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 text-white px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all resize-none"
                      placeholder="Describe qué tipo de experiencias incluye..."
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={savingEdit}
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl tracking-wide transition-all shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-50 text-xs"
                    >
                      {savingEdit ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      <span>{savingEdit ? "Guardando..." : "Guardar Cambios"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-5 py-3 rounded-xl tracking-wide transition-all border border-slate-700 cursor-pointer text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                /* Vista Normal de la Categoría */
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2.5 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-300 bg-blue-900/50 border border-blue-500/30 px-3.5 py-1 rounded-full backdrop-blur-md">
                        <Tag className="h-3.5 w-3.5 text-sky-400" />
                        Categoría Temática
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1 rounded-full backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 text-sky-400" />
                        <span>{events.length} {events.length === 1 ? "evento activo" : "eventos activos"}</span>
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-tight">
                      {category.name}
                    </h1>

                    <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                      {category.description ||
                        "Explora las experiencias, actividades y planes urbanos disponibles en esta categoría temática."}
                    </p>
                  </div>

                  {/* Acciones de Administración */}
                  {user?.role === "admin" && (
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={handleStartEdit}
                        className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-xl tracking-wide transition-all border border-slate-700 cursor-pointer text-xs hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Edit3 className="h-4 w-4 text-sky-400" />
                        <span>Editar Categoría</span>
                      </button>

                      <button
                        type="button"
                        disabled={deleting}
                        onClick={handleDeleteCategory}
                        className="inline-flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-bold px-4 py-3 rounded-xl tracking-wide transition-all border border-red-500/30 disabled:opacity-50 cursor-pointer text-xs"
                      >
                        {deleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span>Eliminar Categoría</span>
                      </button>

                      <Link
                        to={`/events/new?categoryId=${category.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl tracking-wide transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] text-xs"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar evento</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ========================================================
                SECCIÓN: EVENTOS RELACIONADOS / CATÁLOGO DE LA CATEGORÍA
                ======================================================== */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading flex items-center gap-2.5">
                  <Calendar className="h-6 w-6 text-blue-600" />
                  <span>Eventos en {category.name}</span>
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Planes confirmados que puedes explorar e interactuar directamente
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200/90 px-3 py-1.5 rounded-full shadow-xs">
                <span>{events.length} resultados</span>
              </span>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xs max-w-xl mx-auto space-y-4">
                <div className="inline-flex p-4 bg-slate-100 text-slate-400 rounded-2xl">
                  <CalendarX className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">
                  Sin eventos en esta categoría
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Actualmente no hay eventos programados para{" "}
                  <strong className="text-slate-700 font-semibold">
                    {category.name}
                  </strong>
                  . Puedes consultar otras categorías o crear un nuevo evento.
                </p>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
                  >
                    Ver otras categorías
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to={`/events/new?categoryId=${category.id}`}
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Crear primer evento</span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isFavorite={favoriteIds.includes(event.id)}
                    onFavoriteToggle={(isFav) => {
                      if (isFav) {
                        setFavoriteIds((prev) => [...prev, event.id]);
                      } else {
                        setFavoriteIds((prev) =>
                          prev.filter((id) => id !== event.id)
                        );
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;