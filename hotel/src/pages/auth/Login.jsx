import { useState } from "react";
import { login as loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await loginApi(form.username, form.password);

    // Store in AuthContext + localStorage
    login(
      { 
        username: res.data.username, 
        role: res.data.role,
        hasProfile: res.data.hasProfile 
      },
      res.data.token
    );

    // Role-based navigation
    if (res.data.role === "GUEST") {
      if (res.data.hasProfile === false) {
        navigate("/profile");
      } else {
        navigate("/home");
      }
    } else if (res.data.role === "ADMIN") {
      navigate("/dashboard/admin");
    } else if (res.data.role === "STAFF") {
      navigate("/dashboard/staff");
    }

  } catch (err) {
    alert("Invalid username or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-lg w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-700">Login</h1>

        <div>
          <label className="block text-gray-600 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}