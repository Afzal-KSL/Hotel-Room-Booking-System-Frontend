import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser } from '../../api/userApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/Button';
import AddStaffModal from '../../components/AddStaffModal';

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('STAFF');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users', activeTab],
    queryFn: () => getUsers(activeTab),
  });
  const users = usersResponse?.data || [];

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['users', activeTab] });
    },
    onError: (error) => {
      alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout title="User Management">
      {isModalOpen && <AddStaffModal onClose={() => setIsModalOpen(false)} />}
      
      <div className="mb-4 border-b">
        <nav className="-mb-px flex space-x-6">
          <button onClick={() => setActiveTab('STAFF')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'STAFF' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Staff
          </button>
          <button onClick={() => setActiveTab('GUEST')} className={`py-3 px-1 border-b-2 font-medium ${activeTab === 'GUEST' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            Guests
          </button>
        </nav>
      </div>

      <div className="mb-4 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>Add New Staff</Button>
      </div>

      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left font-semibold">User ID</th>
                <th className="p-3 text-left font-semibold">Username</th>
                <th className="p-3 text-left font-semibold">Role</th>
                <th className="p-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user, index) => (
                <tr key={user.userId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-3">{user.userId}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">
                    <Button variant="danger" onClick={() => handleDelete(user.userId)} disabled={deleteUserMutation.isPending}>
                      Delete
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">No users found for this role.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}