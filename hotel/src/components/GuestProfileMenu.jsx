import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGuestByEmail, updateGuest, createGuest } from "../api/guestApi";

export default function GuestProfileMenu() {
  const { user } = useAuth(); // user.username is the login field
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load profile when menu opens – only fetch ONCE per opening
  useEffect(() => {
    if (open && user?.username) {
      setLoading(true);
      (async () => {
        try {
          // Assumes the user's username is the email (if not, adjust here)
          const res = await getGuestByEmail(user.username);
          if (res?.data) {
            setForm({
              firstName: res.data.firstName || "",
              lastName: res.data.lastName || "",
              email: res.data.email || ""
            });
            setGuestId(res.data.guestId);
          } else {
            // New profile/no details found
            setForm({ firstName: "", lastName: "", email: user.username });
            setGuestId(null);
          }
        } catch {
          setForm({ firstName: "", lastName: "", email: user.username });
          setGuestId(null);
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [open, user?.username]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (guestId) {
        console.log("Updating guest:", guestId, form);
        await updateGuest(guestId, form);
      } else {
        console.log("Creating guest:", form);
        await createGuest(form);
      }
      setOpen(false);
    } catch (error) {
      console.error("Failed to save guest profile", error);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative">
      {/* Profile avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 hover:ring-2 ring-blue-200 transition"
        title="Edit Profile"
      >
        <span className="text-2xl">👤</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-4 w-72 bg-white border rounded shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
          {loading ? (
            <div className="text-center py-6 text-blue-400">Loading...</div>
          ) : (
            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                className="border p-2 rounded"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                className="border p-2 rounded"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="border p-2 rounded"
                disabled // always same as login, don't allow changing
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}