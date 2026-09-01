import { Link } from 'react-router';

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center  bg-linear-to-b from-white to-red-100  px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-md">
        {/* Código de error 403 (Acceso Prohibido/No Autorizado) */}
        <h1 className="text-9xl font-black tracking-tight text-red-600 sm:text-[12rem] leading-none">
          403
        </h1>
        
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Acceso no autorizado
        </h2>
        
        <p className="mt-6 text-base leading-7 text-gray-600">
          No tienes los permisos necesarios para ver esta sección. Si crees que esto es un error, contacta al administrador.
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}