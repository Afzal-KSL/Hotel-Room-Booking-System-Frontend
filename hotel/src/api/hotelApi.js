import axiosInstance from "./axiosInstance";

export const getHotels = () => {
  return axiosInstance.get("/hotels")
    .catch(error => {
      console.error("Error fetching hotels:", error);
      throw error;
    });
};

export const getHotel = (id, checkDate = null) => {
  const url = checkDate ? `/hotels/${id}?checkDate=${checkDate}` : `/hotels/${id}`;
  return axiosInstance.get(url)
    .catch(error => {
      console.error(`Error fetching hotel ${id}:`, error);
      throw error;
    });
};

export const searchHotels = (keyword) => {
  return axiosInstance.get(`/hotels/search?keyword=${keyword}`)
    .catch(error => {
      console.error("Error searching hotels:", error);
      throw error;
    });
};

export const createHotel = (formData) =>
  axiosInstance.post("/hotels", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateHotel = (id, formData) =>
  axiosInstance.put(`/hotels/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteHotel = (id) => axiosInstance.delete(`/hotels/${id}`);