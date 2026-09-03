import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    await logout();
    navigate("/?logout=success");
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "text-blue-600 bg-blue-50/80 font-bold shadow-xs"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
      isActive
        ? "text-blue-600 bg-blue-50 font-bold"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
    }`;

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50 shadow-xs transition-all">
      <nav className="h-full flex items-center justify-between max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Logotipo con micro-interacción */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="group flex items-center gap-2.5 tracking-tight font-black text-xl text-slate-800"
          >
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <span className="bg-linear-to-r from-slate-900 via-slate-800 to-blue-600 bg-clip-text text-transparent font-heading">
              Plan<span className="text-blue-600">City</span>
            </span>
          </Link>

          {/* Enlaces Principales de Escritorio */}
          <ul className="hidden md:flex items-center gap-1.5">
            <li>
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/events" className={navLinkClass}>
                Eventos
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories" className={navLinkClass}>
                Categorías
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/favorites" className={navLinkClass}>
                  Favoritos
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Zona de Usuario / Acciones (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200/60 pl-3 pr-1.5 py-1.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-linear-to-br from-slate-700 to-slate-900 text-white text-xs font-bold flex items-center justify-center uppercase shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-700 max-w-28 truncate">
                    {user.name}
                  </span>
                  {user.role === "admin" && (
                    <span className="bg-linear-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1"></div>

              <button
                onClick={handleLogoutClick}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50/80 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Iniciar sesión</span>
            </Link>
          )}
        </div>

        {/* Botón Menú Móvil (Hamburguesa) */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <NavLink to="/" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/events" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Eventos
          </NavLink>
          <NavLink to="/categories" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
            Categorías
          </NavLink>
          {user && (
            <NavLink to="/favorites" className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Favoritos
            </NavLink>
          )}

          <div className="border-t border-slate-100 pt-3 mt-2">
            {user ? (
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-slate-800 text-white text-xs font-bold flex items-center justify-center uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-2xl text-sm"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;