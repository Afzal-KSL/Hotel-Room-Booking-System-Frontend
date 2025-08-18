import { useState } from "react";
import { addRate, updateRate } from "../../api/rateApi";

export default function RateForm() {
  const [form, setForm] = useState({
    hotelId: "",
    roomTypeId: "",
    date: "",
    rate: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    await addRate(form);
    alert("Rate Added");
  };

  const handleUpdate = async () => {
    await updateRate(form);
    alert("Rate Updated");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Rates</h1>
      <input className="border p-2 w-full" name="hotelId" placeholder="Hotel ID" onChange={handleChange} />
      <input className="border p-2 w-full" name="roomTypeId" placeholder="Room Type ID" onChange={handleChange} />
      <input className="border p-2 w-full" type="date" name="date" onChange={handleChange} />
      <input className="border p-2 w-full" name="rate" placeholder="Rate" onChange={handleChange} />
      <div className="flex space-x-2 mt-2">
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2">Add</button>
        <button onClick={handleUpdate} className="bg-green-600 text-white px-4 py-2">Update</button>
      </div>
    </div>
  );
}