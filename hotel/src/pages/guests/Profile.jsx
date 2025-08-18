import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: user?.username || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/profile/guest", form);
      alert("Profile created successfully! You can now browse and book hotels.");
      navigate("/home");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">Complete Your Profile</h1>
        <p className="text-gray-600 text-center">Please provide your details to continue</p>
        
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
        
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="border p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
        />
        
        <input
          type="email"
          name="email"
          value={form.email}
          className="border p-3 w-full rounded bg-gray-100"
          disabled
        />
        
        <button 
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {loading ? "Creating Profile..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}