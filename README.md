# Plataforma de Gestión de Eventos (PlanCity) — React & TypeScript (Prueba de Desempeño Riwi)

Este proyecto es una aplicación frontend desarrollada en **React 19**, **TypeScript** y **Tailwind CSS v4**, conectada a un servicio REST API desarrollado en **NestJS**. Diseñada bajo estándares de arquitectura limpia, modularidad y tolerancia a fallos.

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
* **Node.js** (versión 18 o superior recomendada)
* **npm**
* Backend en ejecución en `http://localhost:3000` (o configurado mediante variable de entorno).

### Variables de Entorno (Opcional)
Puedes configurar la URL base del backend creando un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000
```

### Paso 1: Clonar e Instalar Dependencias
Instala los paquetes necesarios ejecutando en la raíz del proyecto:
```bash
npm install
```

### Paso 2: Levantar el Servidor de Desarrollo
Inicia la aplicación en modo desarrollo local:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:5173](http://localhost:5173).

### Paso 3: Ejecutar la Suite de Pruebas (Módulo 7)
Ejecuta las pruebas unitarias y de integración automatizadas con Vitest:
```bash
npm run test
```

### Paso 4: Compilar para Producción
Genera la carpeta optimizada `/dist` para el despliegue:
```bash
npm run build
```

---

## 🛠️ Tecnologías y Librerías Utilizadas (Con Racionales)

El proyecto selecciona cuidadosamente sus dependencias para garantizar consistencia técnica y rendimiento:

### 1. Dependencias de Producción (`dependencies`)

* **React 19 & React DOM (`^19.2.8`):** Biblioteca UI declarativa basada en componentes y hooks reactivos.
* **React Router (`^8.3.1`):** Enrutamiento declarativo del lado del cliente.
  * *¿Por qué se usa?* Administra la navegación interna instantánea (SPA) sin recargar el navegador, extracción de parámetros dinámicos (`useParams`), query params (`useSearchParams`), redirecciones programáticas (`useNavigate`) y rutas protegidas con control de roles.
* **Axios (`^1.20.0`):** Cliente HTTP basado en promesas.
  * *¿Por qué se usa en lugar de fetch?*
    1. **Interceptores automáticos:** Adjunta el token JWT (`Bearer token`) de `localStorage` en cada petición y maneja respuestas de error globales (ej: deslogueo en 401).
    2. **Manejo de Errores centralizado:** Detecta respuestas fuera del rango 2xx y facilita el mapeo hacia la clase `AppError`.
    3. **Conversión automática de JSON:** Procesa las respuestas sin requerir llamadas adicionales (`res.json()`).
* **Tailwind CSS v4 & `@tailwindcss/vite` (`^4.3.3`):** Framework de utilidades CSS.
  * *¿Por qué se usa?* Permite construir interfaces estilizadas, responsive y accesibles con rendimiento optimizado mediante el compilador integrado de Vite.

### 2. Dependencias de Desarrollo (`devDependencies`)

* **TypeScript (`~6.0.2`):** Tipado estático e interfaces estrictas que previenen errores en tiempo de ejecución.
* **Vitest (`^4.1.11`):** Test runner moderno y nativo para Vite.
  * *¿Por qué se usa en lugar de Jest?* Integración instantánea con la configuración de Vite, ejecución ultra rápida y soporte ESM nativo.
* **JSDOM (`^29.1.1`):** Emulación del DOM del navegador en memoria para ejecutar tests en Node.js.
* **React Testing Library & `@testing-library/jest-dom`:** Pruebas de integración centradas en el comportamiento del usuario.

---

## 📂 Estructura del Proyecto

El código está organizado de forma modular dentro del directorio `src/`:

```text
src/
├── components/     # Componentes reutilizables (Card, EventForm, FavoriteButton, ProtectedRoutes, ErrorBoundary, Navbar, LoadingScreen)
├── context/        # Estado global de sesión y usuario (AuthContext)
├── interfaces/     # Contratos y tipos estrictos de TypeScript (user, event, category)
├── layouts/        # Layout principal de la aplicación (MainLayout)
├── pages/          # Vistas principales (Home, Events, EventDetails, CategoryList, CategoryDetail, Login, Register, NotFound, Unauthorized)
│   └── auth/       # Vistas exclusivas para usuarios autenticados / admin (CreateCategory, FavoritesList)
├── router/         # Configuración centralizada de rutas (createBrowserRouter)
├── services/       # Clientes de consumo HTTP con Axios (apiClient, auth, event, category, favorite)
├── test/           # Pruebas unitarias e integración (Card.test, Login.test, dateFormatter.test, priceFormatter.test, setup)
└── utils/          # Manejador centralizado de errores (AppError) y formateadores (dateFormatter, priceFormatter)
```

### Racionalidad de la Arquitectura
1. **Separación de Responsabilidades:** Las vistas y componentes no manejan llamadas Axios directas; toda la comunicación externa está aislada en `services/`.
2. **Tolerancia a Fallos:** Los errores de red se procesan mediante `AppError` para devolver mensajes amigables y legibles al usuario final.
3. **Seguridad y Control de Accesos:** Rutas protegidas jerárquicas según autenticación y rol (`admin`).

---

## 🧩 Componentes Clave Desarrollados

### 1. `EventForm.tsx` (Formulario Reutilizable Inteligente)
* Se adapta automáticamente según los parámetros de la URL:
  * **Modo Edición:** En `/events/edit/:id` consulta el evento por ID y precarga sus datos.
  * **Creación Contextualizada:** En `/events/new?categoryId=:id` preselecciona y bloquea la categoría asociada.
  * **Creación Libre:** En `/events/new` permite registrar un nuevo evento seleccionando cualquier categoría existente.
* Manejo dinámico de múltiples URLs de imágenes.

### 2. `FavoriteButton.tsx` (Botón de Favoritos Asíncrono)
* Detiene la propagación del evento (`stopPropagation` y `preventDefault`) para evitar disparar la navegación al hacer clic dentro de una tarjeta.
* Maneja estado de carga (`loading`) para prevenir envíos múltiples concurrentes.

### 3. `ErrorBoundary.tsx` (Tolerancia a Fallos Global)
* Componente de clase que atrapa excepciones de renderizado en React, evitando la pantalla en blanco y ofreciendo un botón de recarga junto con un panel de diagnóstico técnico desplegable.

### 4. `ProtectedRoutes.tsx` (Control de Acceso y Roles)
* Valida si el usuario está autenticado y si cuenta con los roles requeridos (`allowedRoles`). Redirige a `/login` si no está autenticado o a `/unauthorized` si no tiene permisos de administrador.

---

## 🔑 Manejo de Sesión: ¿LocalStorage o SessionStorage?

En este proyecto se utiliza **`LocalStorage`** para almacenar el token de acceso JWT.

| Característica | LocalStorage (Elegido) | SessionStorage |
| :--- | :--- | :--- |
| **Persistencia** | Permanente (persiste al recargar o reabrir el navegador). | Temporal (se destruye al cerrar la pestaña o ventana). |
| **Experiencia de Usuario (UX)** | **Óptima:** Mantiene la sesión activa entre pestañas y visitas posteriores sin solicitar credenciales nuevamente. | **Fricción:** Obliga al usuario a iniciar sesión cada vez que abre una pestaña nueva. |
| **Seguridad XSS** | Ambos son accesibles desde JavaScript y comparten similar exposición frente a ataques XSS. | Ambos son accesibles desde JavaScript y comparten similar exposición frente a ataques XSS. |

---

## 🧪 Resumen de Módulos Implementados

1. **Módulo 1 (Autenticación):** Registro, login, obtención de perfil (`/users/me`), logout y persistencia del token con `AuthContext`.
2. **Módulo 2 (Home):** Hero banner informativo y catálogo de los 4 eventos más recientes destacados.
3. **Módulo 3 (Categorías):** Listado público de categorías, vista detallada con eventos filtrados por categoría y formulario de creación exclusivo para administradores.
4. **Módulo 4 (Eventos):** Catálogo con búsqueda por nombre y filtrado reactivo por categoría, galería de miniaturas en detalle, edición y eliminación para administradores.
5. **Módulo 5 (Favoritos):** Marcado/desmarcado asíncrono de favoritos con botón flotante animado y vista `/favorites` con actualización en tiempo real.
6. **Módulo 6 (Manejo de Errores):** Envoltorio global con `ErrorBoundary`, clase `AppError` para respuestas HTTP amigables y botón de simulación de errores en catálogo.
7. **Módulo 7 (Pruebas Automatizadas):** Suite completa con Vitest y Testing Library que incluye pruebas de componentes (`Card.test.tsx`), pruebas de integración (`Login.test.tsx`) y pruebas unitarias de utilidades (`dateFormatter.test.ts`, `priceFormatter.test.ts`).