import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, children }) {
  const { user } = useAuth();
  const showSidebar = user?.role === "ADMIN" || user?.role === "STAFF";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-6">
          {title && <h1 className="text-2xl font-bold mb-4 text-blue-700">{title}</h1>}
          <div className="bg-white shadow rounded p-4">{children}</div>
        </main>
      </div>
    </div>
  );
}