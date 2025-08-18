import { useState, useEffect } from "react";
import { createRoom, updateRoom, getRoom } from "../../api/roomApi";
import { useNavigate, useParams } from "react-router-dom";

export default function RoomForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    roomTypeId: "",
    floor: "",
    number: "",
    name: "",
    isAvailable: true,
    hotelId: "",
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      getRoom(id).then((res) =>
        setForm({
          roomTypeId: res.data.roomTypeId,
          floor: res.data.floor,
          number: res.data.number,
          name: res.data.name,
          isAvailable: res.data.available,
          hotelId: res.data.hotel.hotelId,
        })
      );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append("image", image);

    if (id) {
      await updateRoom(id, formData);
    } else {
      await createRoom(formData);
    }
    navigate("/dashboard/admin");
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">{id ? "Edit Room" : "Add Room"}</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Room Type ID"
          value={form.roomTypeId}
          onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Floor"
          value={form.floor}
          onChange={(e) => setForm({ ...form, floor: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Room Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Room Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={form.isAvailable}
          onChange={(e) => setForm({ ...form, isAvailable: e.target.value === "true" })}
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <input
          className="border p-2 w-full"
          placeholder="Hotel ID"
          value={form.hotelId}
          onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}