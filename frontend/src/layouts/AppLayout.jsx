import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {user ? <Sidebar /> : null}
        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
