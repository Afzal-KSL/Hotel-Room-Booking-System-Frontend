import axiosInstance from "./axiosInstance";

export const getGuests = () => axiosInstance.get("/guests");
export const getGuest = (id) => axiosInstance.get(`/guests/${id}`);
export const createGuest = (guest) => axiosInstance.post("/guests", guest);
export const updateGuest = (id, guest) =>
  axiosInstance.put(`/guests/${id}`, guest);
export const deleteGuest = (id) => axiosInstance.delete(`/guests/${id}`);
export const getGuestByEmail = (email) => {
  return axiosInstance.get(`/guests/by-email`, { params: { email } });
};