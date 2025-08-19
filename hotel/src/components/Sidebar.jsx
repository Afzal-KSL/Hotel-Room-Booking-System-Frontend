import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHotel, FaBed, FaList, FaChartLine, FaCogs, FaTags, FaClipboardList, FaUsers } from 'react-icons/fa';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // Define role-based menu items
const menus = {
  ADMIN: [
    { name: "Dashboard", path: "/dashboard/admin", icon: <FaChartLine /> },
    { name: 'Users', path: '/users', icon: <FaUsers /> },
    { name: "Hotels", path: "/hotels-list", icon: <FaHotel /> },
    { name: "Rooms", path: "/rooms-list", icon: <FaBed /> },
    { name: "Reservations", path: "/reservations-list", icon: <FaClipboardList /> },
    { name: "Inventory", path: "/inventory-list", icon: <FaCogs /> },
    { name: "Rates", path: "/rates-list", icon: <FaTags /> },
  ],
  STAFF: [
    { name: "Dashboard", path: "/dashboard/staff", icon: <FaChartLine /> },
    { name: "Rooms", path: "/rooms-list", icon: <FaBed /> },
    { name: "Reservations", path: "/reservations-list", icon: <FaClipboardList /> },
    { name: "Inventory", path: "/inventory-list", icon: <FaCogs /> },
    { name: "Rates", path: "/rates-list", icon: <FaTags /> },
  ],
};

  const menuItems = menus[user?.role] || [];

  return (
    <aside className="bg-blue-700 text-white w-64 min-h-screen flex flex-col shadow-lg">
      <div className="px-4 py-4 font-bold text-lg border-b border-blue-500">
        {user?.role} Panel
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className={`flex items-center space-x-2 p-2 rounded transition ${
              location.pathname === item.path
                ? "bg-blue-900"
                : "hover:bg-blue-800"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}