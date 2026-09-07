import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import ErrorBoundary from "../components/ErrorBoundary"

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      <Navbar />
      <div className="flex-1 w-full">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default MainLayout