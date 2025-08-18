import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserProfileMenu from "./UserProfileMenu";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-6">
        <Link to="/" className="font-bold text-xl hover:text-blue-200 transition">
          🏨 HotelApp
        </Link>
        
        {user && (
          <div className="flex space-x-4">
            {user.role === "ADMIN" && (
              <>
                <Link to="/dashboard/admin" className="hover:text-blue-200 transition">
                  Admin Panel
                </Link>
                <Link to="/home" className="hover:text-blue-200 transition">
                  Browse Hotels
                </Link>
              </>
            )}
            {user.role === "STAFF" && (
              <>
                <Link to="/dashboard/staff" className="hover:text-blue-200 transition">
                  Staff Panel
                </Link>
                <Link to="/home" className="hover:text-blue-200 transition">
                  Browse Hotels
                </Link>
              </>
            )}
            {user.role === "GUEST" && (
              <Link to="/home" className="hover:text-blue-200 transition">
                Browse Hotels
              </Link>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition font-medium">
              Login
            </Link>
            <Link to="/register" className="border border-white px-4 py-2 rounded hover:bg-white hover:text-blue-600 transition font-medium">
              Register
            </Link>
          </>
        ) : (
          <UserProfileMenu />
        )}
      </div>
    </nav>
  );
}