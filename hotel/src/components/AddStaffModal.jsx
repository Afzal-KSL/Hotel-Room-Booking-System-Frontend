import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStaff } from '../api/userApi';
import Button from './Button';
import Input from './Input';

export default function AddStaffModal({ onClose }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addStaffMutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      alert('Staff member added successfully!');
      queryClient.invalidateQueries({ queryKey: ['users', 'STAFF'] });
      onClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Both username and password are required.');
      return;
    }
    setError('');
    addStaffMutation.mutate(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add New Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email (Username)"
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="staff@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter a strong password"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addStaffMutation.isPending}>
              {addStaffMutation.isPending ? 'Adding...' : 'Add Staff'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}