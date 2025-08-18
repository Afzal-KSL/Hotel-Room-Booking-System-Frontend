import axiosInstance from "./axiosInstance";

export const login = (username, password) =>
  axiosInstance.post("/auth/login", { username, password });

export const register = (data) =>
  axiosInstance.post("/auth/register", data);

export const getUsersByRole = (role) =>
  axiosInstance.get(`/auth/users/role/${role}`);