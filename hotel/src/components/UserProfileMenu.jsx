import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGuestByEmail, updateGuest } from '../api/guestApi';

export default function UserProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [guestId, setGuestId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isDashboard = location.pathname.startsWith('/dashboard');

  useEffect(() => {
    if (open && user?.role === 'GUEST' && user?.username) {
      setLoading(true);
      getGuestByEmail(user.username)
        .then(res => {
          if (res?.data) {
            setForm({
              firstName: res.data.firstName || '',
              lastName: res.data.lastName || '',
              email: res.data.email || user.username
            });
            setGuestId(res.data.guestId);
          }
        })
        .catch(() => console.log("Profile not found or error loading profile"))
        .finally(() => setLoading(false));
    }
  }, [open, user?.role, user?.username]);

  const handleAdminNav = () => {
    if (user.role === 'ADMIN') {
      navigate('/dashboard/admin');
    } else if (user.role === 'STAFF') {
      navigate('/dashboard/staff');
    }
    setOpen(false);
  };
  
  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'ADMIN': return 'Administrator';
      case 'STAFF': return 'Staff Member';
      case 'GUEST': return 'Guest';
      default: return 'User';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (guestId) {
        await updateGuest(guestId, form);
        alert('Profile updated successfully!');
      }
      setOpen(false);
    } catch (error) {
      console.error('Failed to save guest profile', error);
      alert('Error saving profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 hover:ring-2 ring-blue-200 transition"
        title="Profile Menu"
      >
        <span className="text-2xl font-bold">{user?.username[0].toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-72 bg-white border rounded shadow-lg p-4 z-50">
          <div className="border-b pb-3 mb-3">
            <h3 className="text-lg font-semibold text-blue-700">{getRoleDisplayName()}</h3>
            <p className="text-sm text-gray-600">{user?.username}</p>
          </div>

          {(user.role === 'ADMIN' || user.role === 'STAFF') && (
            <div className="space-y-2">
              {isDashboard ? (
                <Link
                  to="/home"
                  className="block w-full text-left px-3 py-2 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Go to Home
                </Link>
              ) : (
                <button
                  onClick={handleAdminNav}
                  className="block w-full text-left px-3 py-2 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium transition-colors"
                >
                  Go to Admin Panel
                </button>
              )}
            </div>
          )}
          
          {user.role === 'GUEST' && (
             <div>
              <h4 className="font-medium mb-3">Edit Profile</h4>
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
                    value={user.username}
                    className="border p-2 rounded bg-gray-100"
                    disabled
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div className="border-t pt-3 mt-3">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm rounded bg-red-100 hover:bg-red-200 text-red-900 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}