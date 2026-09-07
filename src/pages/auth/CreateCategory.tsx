import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createCategory } from "../../services/category.service";
import Card from "../../components/Card";

const CreateCategory = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Estados de control
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setValidationErrors([]);

    try {
      await createCategory({ name, description });
      navigate("/categories"); // Volver al listado
    } catch (err: any) {
      console.error("Create category error:", err);
      // Extraer mensaje amigable de AppError
      setErrorMsg(err.friendlyMessage || "No se pudo crear la categoría.");
      if (err.validationErrors) {
        setValidationErrors(err.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0e0c15] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Halo ambiental neón */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      {/* Botón Volver */}
      <div className="w-full max-w-md mb-4 text-left relative z-10">
        <Link
          to="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-violet-400 transition-colors group cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Volver al listado</span>
        </Link>
      </div>

      <Card
        title="Nueva Categoría"
        subtitle="Agrega una nueva clasificación para organizar tus eventos."
      >
        {/* Renderizado de errores generales */}
        {errorMsg && (
          <div className="mb-5 p-4 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-start gap-3 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="grow">
              <p className="text-red-300 text-sm font-semibold leading-relaxed">{errorMsg}</p>
              {validationErrors.length > 0 && (
                <ul className="list-disc pl-4 mt-1.5 text-xs text-red-400 space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="cat-name-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Nombre de la categoría
            </label>
            <input
              id="cat-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Conciertos, Picnics, Caminatas, etc."
              className="w-full bg-[#0e0c15] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white placeholder-slate-500 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none"
            />
          </div>

          {/* Campo Descripción */}
          <div className="space-y-1.5">
            <label htmlFor="cat-desc-input" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Descripción (Opcional)
            </label>
            <textarea
              id="cat-desc-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe qué tipos de eventos abarca esta categoría..."
              rows={4}
              className="w-full bg-[#0e0c15] border border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 text-white placeholder-slate-500 px-4 py-3 rounded-2xl text-sm font-medium transition-all outline-none resize-none"
            />
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-2xl tracking-wide transition-all shadow-lg shadow-violet-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Creando...</span>
              </div>
            ) : (
              "Crear Categoría"
            )}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default CreateCategory;