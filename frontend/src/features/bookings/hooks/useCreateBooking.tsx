import { createBooking } from "@/api/bookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookingFormValues } from "../components/booking-form";

export default function useCreateBooking() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createBookingMutation = useMutation({
    mutationFn: (data: {
      values: BookingFormValues;
      price: number;
      check_out_date: Date;
      booking_status: string;
    }) =>
      createBooking(
        data.values,
        data.price,
        data.check_out_date,
        data.booking_status
      ),
    onSuccess: () => {
      navigate("/bookings");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking created");
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return createBookingMutation;
}
