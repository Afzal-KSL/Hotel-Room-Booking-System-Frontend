import axiosInstance from "./axiosInstance";

export const getInventory = (hotelId, roomTypeId, date) =>
  axiosInstance.get(`/inventory`, {
    params: { hotelId, roomTypeId, date },
  });

export const getInventoryByHotel = (hotelId) =>
  axiosInstance.get(`/inventory/hotel/${hotelId}`);

export const reserveRooms = (data) =>
  axiosInstance.put("/inventory/reserve", data);

export const releaseRooms = (data) =>
  axiosInstance.put("/inventory/release", data);

export const updateCapacity = (data) =>
  axiosInstance.put("/inventory/capacity", data);