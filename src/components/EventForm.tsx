import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router";
import { createEvent, getEventById, updateEvent } from "../services/event.service";
import { getAllCategories } from "../services/category.service";
import type { Category } from "../interfaces/category.interface";
import Card from "./Card";

const EventForm = () => {
  const { id } = useParams<{ id: string }>(); // Si existe, estamos en modo Edición
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  // Estados del formulario
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(""); // Guardamos la fecha como string para el input
  const [location, setLocation] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [images, setImages] = useState<string[]>([""]); // Inicia con un input vacío

  // Estados de control
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingData, setFetchingData] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 1. Cargar las categorías existentes para el select
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catData = await getAllCategories();
        setCategories(catData);

        // Si viene categoryId en los query-params de la URL, lo preseleccionamos
        const catQuery = searchParams.get("categoryId");
        if (catQuery) {
          setCategoryId(catQuery);
        }
      } catch (err) {
        console.error("Error loading categories in form:", err);
      }
    };
    fetchCategories();
  }, [searchParams]);

  // 2. Si estamos en modo edición, cargar los datos actuales del evento
  useEffect(() => {
    const fetchEventData = async () => {
      if (!isEditMode || !id) return;
      try {
        setFetchingData(true);
        const event = await getEventById(id);
        setName(event.name);
        setDescription(event.description || "");
        setPrice(event.price);
        setLocation(event.location);
        setCategoryId(event.categoryId);
        const imageUrls = event.images && event.images.length > 0
          ? event.images.map((img: any) => (img && typeof img === "object") ? img.url : img)
          : [""];
        setImages(imageUrls);
      } catch (err: any) {
        console.error("Error fetching event data:", err);
        setErrorMsg(err.friendlyMessage || "No se pudo cargar la información del evento.");
      } finally {
        setFetchingData(false);
      }
    };
    fetchEventData();
  }, [id, isEditMode]);

  // Manejo de la lista dinámica de URLs de imágenes
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, ""]);
  };

  const removeImageField = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages.length > 0 ? newImages : [""]);
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setValidationErrors([]);

    // Limpiar URLs de imágenes vacías
    const cleanImages = images.map((img) => img.trim()).filter((img) => img !== "");

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      date: new Date(date),
      location: location.trim(),
      price: Number(price),
      capacity: Number(capacity),
      categoryId,
      images: cleanImages.length > 0 ? cleanImages : undefined,
    };

    try {
      if (isEditMode && id) {
        await updateEvent(id, payload);
        navigate(`/events/${id}`); // Ir al detalle del evento
      } else {
        await createEvent(payload);
        navigate("/"); // Ir al catálogo principal
      }
    } catch (err: any) {
      console.error("Event submit error:", err);
      setErrorMsg(err.friendlyMessage || "Ocurrió un error al procesar el evento.");
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasCategoryFromQuery = !!searchParams.get("categoryId");

  return (
    <div className="min-h-[calc(100vh-60px)] w-full bg-slate-50 flex flex-col items-center justify-center py-12 px-4">
      {/* Botón Volver */}
      <div className="w-full max-w-md mb-4 text-left">
        <Link
          to={isEditMode && id ? `/events/${id}` : "/"}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          {isEditMode ? "Cancelar Edición" : "Volver al catálogo"}
        </Link>
      </div>

      {fetchingData ? (
        <div className="flex flex-col items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <span className="text-slate-500 text-sm font-medium">Cargando evento...</span>
        </div>
      ) : (
        <Card
          title={isEditMode ? "Editar Evento" : "Nuevo Evento"}
          subtitle={
            isEditMode
              ? "Modifica los detalles del evento seleccionado."
              : "Completa la información para agregar un evento al catálogo."
          }
        >
          {/* Renderizado de errores generales */}
          {errorMsg && (
            <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="grow">
                <p className="text-red-700 text-sm font-semibold leading-relaxed">{errorMsg}</p>
                {validationErrors.length > 0 && (
                  <ul className="list-disc pl-4 mt-1 text-xs text-red-600 space-y-1">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre del evento */}
            <div className="space-y-1.5">
              <label htmlFor="event-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Nombre del evento
              </label>
              <input
                id="event-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Rock Festival 2026"
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>

            {/* Categoría (Select condicional) */}
            <div className="space-y-1.5">
              <label htmlFor="event-category" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Categoría
              </label>
              <select
                id="event-category"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={hasCategoryFromQuery}
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-850 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none disabled:bg-slate-100/70 disabled:text-slate-550 disabled:cursor-not-allowed cursor-pointer"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {hasCategoryFromQuery && (
                <p className="text-[10px] text-blue-600 font-bold">
                  * La categoría está predefinida por el contexto.
                </p>
              )}
            </div>

            {/* Fila: Precio*/}
            <div className="grid grid-cols-2 gap-4">
              {/* Precio */}
              <div className="space-y-1.5">
                <label htmlFor="event-price" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Precio (COP)
                </label>
                <input
                  id="event-price"
                  type="number"
                  required
                  min="0"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="Precio"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
                />
              </div>

              {/* date */}
              <div className="space-y-1.5">
                <label htmlFor="event-date" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fecha
                </label>
                <input
                  id="event-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label htmlFor="event-desc" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Descripción
              </label>
              <textarea
                id="event-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Especificaciones técnicas o características del artículo..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none resize-none"
              />
            </div>

            {/* Ubicación */}
            <div className="space-y-1.5">
              <label htmlFor="event-location" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Ubicación
              </label>
              <input
                id="event-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej: Bogotá, Colombia"
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>

            {/* Capacidad */}
            <div className="space-y-1.5">
              <label htmlFor="event-capacity" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Capacidad
              </label>
              <input
                id="event-capacity"
                type="number"
                required
                min="1"
                value={capacity === 0 ? "" : capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                placeholder="Cantidad de personas"
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>

            {/* Lista dinámica de URLs de imágenes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                URLs de Imágenes
              </label>
              
              <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                {images.map((imgUrl, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={imgUrl}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="grow bg-slate-50 border border-slate-200/80 focus:border-blue-500 focus:bg-white text-slate-800 px-4 py-2.5 rounded-xl text-xs font-medium transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Eliminar URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageField}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Agregar otra imagen
              </button>
            </div>

            {/* Botón de Guardar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl tracking-wide transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Guardando...</span>
                </div>
              ) : (
                isEditMode ? "Guardar Cambios" : "Crear Evento"
              )}
            </button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default EventForm;