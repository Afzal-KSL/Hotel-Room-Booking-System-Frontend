import axiosInstance from './axiosInstance';

export const getUsers = (role) => {
  const params = role ? { role } : {};
  return axiosInstance.get('/users', { params });
};

export const addStaff = (staffData) => {
  return axiosInstance.post('/users/staff', staffData);
};

export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/${id}`);
};