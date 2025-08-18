import { useState } from "react";
import { reserveRooms, releaseRooms, updateCapacity } from "../../api/inventoryApi";

export default function InventoryForm() {
  const [form, setForm] = useState({
    hotelId: "",
    roomTypeId: "",
    date: "",
    count: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAction = async (type) => {
    if (type === "reserve") await reserveRooms(form);
    else if (type === "release") await releaseRooms(form);
    else await updateCapacity(form);
    alert("Action successful");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Inventory Management</h1>
      <div className="space-y-3">
        <input className="border p-2 w-full" name="hotelId" placeholder="Hotel ID" onChange={handleChange} />
        <input className="border p-2 w-full" name="roomTypeId" placeholder="Room Type ID" onChange={handleChange} />
        <input className="border p-2 w-full" type="date" name="date" onChange={handleChange} />
        <input className="border p-2 w-full" name="count" placeholder="Count" onChange={handleChange} />
        <div className="flex space-x-2">
          <button onClick={() => handleAction("reserve")} className="bg-blue-500 text-white px-4 py-2">Reserve</button>
          <button onClick={() => handleAction("release")} className="bg-yellow-500 text-white px-4 py-2">Release</button>
          <button onClick={() => handleAction("capacity")} className="bg-green-500 text-white px-4 py-2">Update Capacity</button>
        </div>
      </div>
    </div>
  );
}