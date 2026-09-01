import { Link } from 'react-router'; // Opcional: cámbialo por <a> si no usas react-router

const NotFound = () => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-md">
        {/* Código de error gigante */}
        <h1 className="text-9xl font-black tracking-tight text-blue-600 sm:text-[12rem] leading-none">
          404
        </h1>
        
        {/* Mensaje principal */}
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          ¡Ups! Página no encontrada
        </h2>
        
        {/* Descripción secundaria */}
        <p className="mt-6 text-base leading-7 text-gray-600">
          Lo sentimos, el enlace que seguiste está roto o la página ha sido eliminada por completo.
        </p>
        
        {/* Botón de acción */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFound