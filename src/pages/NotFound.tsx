import { Link } from 'react-router';

const NotFound = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 text-slate-900 px-6 py-24 sm:py-32 lg:px-8 relative overflow-hidden">
      <div className="text-center max-w-lg relative z-10 bg-white border border-slate-200/90 p-10 md:p-14 rounded-3xl shadow-xl">
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-blue-600 leading-none">
          404
        </h1>
        
        <h2 className="mt-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          ¡Ups! Página no encontrada
        </h2>
        
        <p className="mt-4 text-sm md:text-base leading-relaxed text-slate-600 max-w-sm mx-auto">
          Lo sentimos, el enlace que seguiste no existe, está roto o la página ha sido reubicada.
        </p>
        
        <div className="mt-8 flex items-center justify-center">
          <Link
            to="/"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;