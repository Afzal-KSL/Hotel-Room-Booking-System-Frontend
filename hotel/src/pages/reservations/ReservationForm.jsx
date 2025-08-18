import { useState } from "react";
import { createReservation } from "../../api/reservationApi";
import { useNavigate } from "react-router-dom";

export default function ReservationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    hotelId: "",
    guestId: "",
    roomId: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createReservation(form);
    navigate("/dashboard/guest");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Book Room</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="border p-2 w-full" name="hotelId" placeholder="Hotel ID" onChange={handleChange} />
        <input className="border p-2 w-full" name="guestId" placeholder="Guest ID" onChange={handleChange} />
        <input className="border p-2 w-full" name="roomId" placeholder="Room ID" onChange={handleChange} />
        <input className="border p-2 w-full" type="date" name="startDate" onChange={handleChange} />
        <input className="border p-2 w-full" type="date" name="endDate" onChange={handleChange} />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Book Now</button>
      </form>
    </div>
  );
}