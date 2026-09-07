import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllCategories } from "../services/category.service";
import type { Category } from "../interfaces/category.interface";

const CategoriesList = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err: any) {
        console.error("Error loading categories:", err);
        setErrorMsg(
          err.friendlyMessage || "No se pudieron cargar las categorías."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    const matchName = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDesc = cat.description
      ? cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    return matchName || matchDesc;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            HERO / ENCABEZADO DE CATEGORÍAS
            ======================================================== */}
        <div className="relative overflow-hidden bg-[#0f172a] rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl mb-12">
          {/* Elementos decorativos de fondo */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-300 bg-blue-900/50 border border-blue-500/30 px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-md">
                <FolderKanban className="h-3.5 w-3.5 text-sky-400" />
                Explorador de Temáticas
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-tight">
                Catálogo de <span className="text-sky-400">Categorías</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
                Descubre planes en la ciudad clasificados por área de interés:
                música en vivo, gastronomía, conferencias, deportes y arte.
              </p>
            </div>

            {user?.role === "admin" && (
              <Link
                to="/categories/new"
                className="self-start md:self-auto inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-2xl tracking-wide transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                <Plus className="h-5 w-5" />
                <span>Crear Categoría</span>
              </Link>
            )}
          </div>

          {/* Barra de búsqueda integrada */}
          <div className="relative z-10 mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 shadow-xs">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span className="text-red-700 text-sm font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Estado de Carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-sm font-semibold text-slate-500">
              Cargando catálogo de categorías...
            </p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm max-w-lg mx-auto space-y-4">
            <div className="inline-flex p-4 bg-slate-100 text-slate-400 rounded-2xl">
              <Layers className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              {searchQuery ? "No se encontraron categorías" : "No hay categorías registradas"}
            </h3>
            <p className="text-slate-500 text-sm">
              {searchQuery
                ? `No hay ninguna temática que coincida con "${searchQuery}".`
                : "Aún no se han configurado categorías en la plataforma."}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Ver todas las categorías
              </button>
            )}
          </div>
        ) : (
          /* ========================================================
              GRID DE TARJETAS DE CATEGORÍA MODERNAS
              ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group relative bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:shadow-xl hover:border-blue-400/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* Acento decorativo sutil en hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full pointer-events-none" />

                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                      <FolderKanban className="h-6 w-6" />
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/60 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      Temática
                    </span>
                  </div>

                  {/* Nombre */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors font-heading tracking-tight leading-snug">
                    {category.name}
                  </h3>

                  {/* Descripción */}
                  <p className="text-slate-600 text-sm mt-3 line-clamp-3 leading-relaxed font-normal">
                    {category.description ||
                      "Explora las diversas experiencias y planes vinculados a esta temática."}
                  </p>
                </div>

                {/* Footer de la Tarjeta */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                    <span>Ver eventos asociados</span>
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesList;