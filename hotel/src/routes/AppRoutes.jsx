import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/hotels/Home";
import HotelDetails from "../pages/hotels/HotelDetails";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import StaffDashboard from "../pages/dashboard/StaffDashboard";
import GuestDashboard from "../pages/dashboard/GuestDashboard";

import HotelForm from "../pages/hotels/HotelForm";
import RoomForm from "../pages/rooms/RoomForm";
import ReservationForm from "../pages/reservations/ReservationForm";

import HotelList from "../pages/hotels/HotelList";
import RoomList from "../pages/rooms/RoomList";
import ReservationList from "../pages/reservations/ReservationList";
import InventoryList from "../pages/inventory/InventoryList";
import RateList from "../pages/rates/RateList";
import Profile from "../pages/guests/Profile";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected: Any logged in role can access Home & Hotel Details */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF', 'GUEST']} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
        </Route>

        {/* Guest must first complete profile */}
        <Route element={<ProtectedRoute allowedRoles={['GUEST']} />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard/guest" element={<GuestDashboard />} />
          <Route path="/book" element={<ReservationForm />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/hotels-list" element={<HotelList />} />
          <Route path="/rooms-list" element={<RoomList />} />
          <Route path="/reservations-list" element={<ReservationList />} />
          <Route path="/inventory-list" element={<InventoryList />} />
          <Route path="/rates-list" element={<RateList />} />
          
          <Route path="/add-hotel" element={<HotelForm />} />
          <Route path="/edit-hotel/:id" element={<HotelForm />} />
          <Route path="/add-room" element={<RoomForm />} />
          <Route path="/edit-room/:id" element={<RoomForm />} />
        </Route>

        {/* Staff routes */}
        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
          <Route path="/rooms-list" element={<RoomList />} />
          <Route path="/reservations-list" element={<ReservationList />} />
          <Route path="/inventory-list" element={<InventoryList />} />
          <Route path="/rates-list" element={<RateList />} />
          
          <Route path="/add-room" element={<RoomForm />} />
          <Route path="/edit-room/:id" element={<RoomForm />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}