import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CategoriesList from "../pages/CategoryList"
import CategoryDetail from "../pages/CategoryDetail";
import CreateCategory from "../pages/auth/CreateCategory";
import EventForm from "../components/EventForm";
import Events from "../pages/Events";
import FavoritesList from "../pages/auth/FavoritesList";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoutes";
import EventDetail from "../pages/EventDetails";
import Unauthorized from "../pages/Unauthorized";

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children:[
      {
        index: true,
        element: <Home/>
      },
      {
        path: '/login',
        element: <Login/>,
      },
      {
        path: '/register',
        element: <Register/>,
      },
      // Rutas públicas de categorías
      {
        path: '/categories',
        element: <CategoriesList />,
      },
      {
        path: '/categories/:id',
        element: <CategoryDetail />,
      },
      // Rutas públicas de events
      {
        path: '/events',
        element: <Events />,
      },
      {
        path: '/events/:id',
        element: <EventDetail />,
      },
      // 1. Rutas protegidas para cualquier usuario autenticado (Nivel 1)
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: '/favorites',
            element: <FavoritesList />,
          },
          {
            path: '/events/new',
            element: <EventForm />,
          },
          {
            path: '/events/edit/:id',
            element: <EventForm />,
          }
        ]
      },
      // 2. Rutas protegidas exclusivas para rol Admin (Nivel 2)
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: '/categories/new',
            element: <CreateCategory />
          }
        ]
      }
    ]   
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />
  }
]);