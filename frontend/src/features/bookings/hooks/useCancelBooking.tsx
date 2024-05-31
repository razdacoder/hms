import { cancelBooking } from "@/api/bookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  id: string;
};

export default function useCancelBooking({ id }: Props) {
  const queryClient = useQueryClient();
  const cancelBookingMutation = useMutation({
    mutationFn: () => cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return cancelBookingMutation;
}
