import { useState, useEffect } from "react";
import { createHotel, updateHotel, getHotel } from "../../api/hotelApi";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function HotelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", address: "", location: "" });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      getHotel(id).then(res => setForm(res.data));
    }
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("address", form.address);
    fd.append("location", form.location);
    if (image) fd.append("image", image);

    if (id) await updateHotel(id, fd);
    else await createHotel(fd);
    navigate("/dashboard/admin");
  };

  return (
    <DashboardLayout title={id ? "Edit Hotel" : "Add Hotel"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Hotel Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <Button type="submit">{id ? "Update" : "Create"}</Button>
      </form>
    </DashboardLayout>
  );
}