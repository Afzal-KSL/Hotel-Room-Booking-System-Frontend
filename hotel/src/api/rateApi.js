import axiosInstance from "./axiosInstance";

export const getRates = () => axiosInstance.get("/rates");
export const addRate = (rate) => axiosInstance.post("/rates", rate);
export const updateRate = (rate) => axiosInstance.put("/rates", rate);
export const getRate = (hotelId, roomTypeId, date) =>
  axiosInstance.get(`/rates/${hotelId}/${roomTypeId}/${date}`);