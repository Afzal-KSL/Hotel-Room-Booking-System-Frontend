import axiosInstance from "./axiosInstance";

export const getRooms = () => axiosInstance.get("/rooms");
export const getRoom = (id) => axiosInstance.get(`/rooms/${id}`);

export const createRoom = (formData) =>
  axiosInstance.post("/rooms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRoom = (id, formData) =>
  axiosInstance.put(`/rooms/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteRoom = (id) => axiosInstance.delete(`/rooms/${id}`);