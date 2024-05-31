import { BookingFormValues } from "@/features/bookings/components/booking-form";
import { api } from "./api";

export const createBooking = async (
  values: BookingFormValues,
  price: number,
  check_out_date: Date,
  res_status: string
) => {
  const response = await api.post("/bookings", {
    ...values,
    price,
    check_out_date,
    res_status,
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
