import axiosInstance from "./axiosInstance";

export const getReservations = () => axiosInstance.get("/reservations");
export const getReservation = (id) =>
  axiosInstance.get(`/reservations/${id}`);
export const createReservation = (data) =>
  axiosInstance.post("/reservations", data);
export const updateReservation = (id, data) =>
  axiosInstance.put(`/reservations/${id}`, data);
export const deleteReservation = (id) =>
  axiosInstance.delete(`/reservations/${id}`);

export const createBooking = (bookingData) => {
  return axiosInstance.post("/reservations", bookingData)
    .catch(error => {
      console.error("Error creating booking:", error);
      throw error;
    });
};

export const checkRoomAvailability = (roomId, checkIn, checkOut) => {
  return axiosInstance.get(`/rooms/${roomId}/availability`, {
    params: { checkIn, checkOut }
  }).catch(error => {
    console.error("Error checking availability:", error);
    throw error;
  });
};