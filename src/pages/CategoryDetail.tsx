import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getCategoryById, updateCategory, deleteCategory } from "../services/category.service";
import { getAllEvents } from "../services/event.service";
import type { Category } from "../interfaces/category.interface";
import type { Event } from "../interfaces/event.interface";
import EventCard from "../components/EventCard";

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

  // Estados para Edición y Eliminación de Categoría
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

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
      alert(`No se puede eliminar la categoría porque tiene ${events.length} evento(s) asignado(s).`);
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
      alert(err.friendlyMessage || "Ocurrió un error al intentar eliminar la categoría.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchCategoryAndEvents = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const categoryData = await getCategoryById(id);
        setCategory(categoryData);

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
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-6 transition-colors group cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver a Categorías</span>
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : errorMsg || !category ? (
        <div className="p-5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-red-700 text-sm font-semibold">{errorMsg || "Categoría no encontrada."}</span>
        </div>
      ) : (
        <div>
          {/* Encabezado de la Categoría */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xl mb-10">
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Editar Categoría</span>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Nombre de la categoría</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                    placeholder="Nombre de la categoría"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Descripción (Opcional)</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-slate-900 px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all resize-none"
                    placeholder="Descripción de la categoría..."
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl tracking-wide transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {savingEdit ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span>{savingEdit ? "Guardando..." : "Guardar Cambios"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl tracking-wide transition-all border border-slate-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1">
                    Categoría
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-3 font-heading">{category.name}</h1>
                  <p className="text-slate-600 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                    {category.description || "Esta categoría no posee una descripción cargada en el sistema."}
                  </p>
                </div>
                
                {user?.role === "admin" && (
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="grow sm:grow-0 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3.5 rounded-xl tracking-wide transition-all border border-slate-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Editar Categoría
                    </button>

                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDeleteCategory}
                      className="grow sm:grow-0 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-6 py-3.5 rounded-xl tracking-wide transition-all border border-red-200 disabled:opacity-50 cursor-pointer"
                    >
                      {deleting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent"></div>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      Eliminar Categoría
                    </button>

                    <Link
                      to={`/events/new?categoryId=${category.id}`}
                      className="grow sm:grow-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl tracking-wide transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar evento
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Listado de Eventos de la Categoría */}
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 font-heading">Eventos Relacionados</h2>
          
          {events.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl p-8 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-bold text-slate-900">Sin eventos</h3>
              <p className="text-slate-600 text-sm mt-1">Aún no se han registrado eventos asociados a esta categoría.</p>
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
                      setFavoriteIds((prev) => prev.filter((id) => id !== event.id));
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;