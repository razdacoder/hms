import { checkInBooking } from "@/api/bookings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type Props = {
  id: string;
};

export default function useCheckIn({ id }: Props) {
  const queryClient = useQueryClient();
  const checkInMutation = useMutation({
    mutationFn: () => checkInBooking(id),
    onSuccess: () => {
      toast.success("Check In Successful");
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return checkInMutation;
}
