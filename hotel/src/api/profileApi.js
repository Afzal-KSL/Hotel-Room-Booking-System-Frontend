import axiosInstance from "./axiosInstance";

export const createGuestProfile = (data) =>
  axiosInstance.post("/profile/guest", data);

export const getUserProfile = () =>
  axiosInstance.get("/profile");