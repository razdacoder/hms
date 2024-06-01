import { BookingFormValues } from "@/features/bookings/components/booking-form";
import { api } from "./api";

export const createBooking = async (
  values: BookingFormValues,
  price: number,
  check_out_date: Date,
  booking_status: string
) => {
  const response = await api.post("/bookings", {
    ...values,
    price,
    check_out_date,
    booking_status,
  });
  if (response.status != 201) {
    throw new Error("Could not create booking");
  }

  return response.data;
};

export const getBookings = async () => {
  const response = await api.get("/bookings");
  if (response.status != 200) {
    throw new Error("Failed to fetch bookings");
  }

  return response.data as Booking[];
};

export const getBooking = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  if (response.status != 200) {
    throw new Error("Failed to fetch booking");
  }
  return response.data as Booking;
};

export const checkInBooking = async (id: string) => {
  const response = await api.post(`/bookings/check-in/${id}`);
  if (response.status != 200) {
    throw new Error("Failed to check in");
  }
  return response.data;
};

export const checkOutBooking = async (id: string) => {
  const response = await api.post(`/bookings/check-out/${id}`);
  if (response.status != 200) {
    throw new Error("Failed to check out");
  }
  return response.data;
};

export const cancelBooking = async (id: string) => {
  const response = await api.patch(`/bookings/${id}`, {
    booking_status: "Cancelled",
  });
  if (response.status != 200) {
    throw new Error("Failed to cancel booking");
  }
  return response.data;
};

export const deleteBooking = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  if (response.status != 200) {
    throw new Error("Failed to delete booking");
  }
  return response.data;
};
