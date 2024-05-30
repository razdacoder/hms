import { getBooking } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: string;
};

export default function useBooking({ id }: Props) {
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
  });
  return { booking, bookingLoading };
}
