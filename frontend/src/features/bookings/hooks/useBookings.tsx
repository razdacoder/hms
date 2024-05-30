import { getBookings } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";

export default function useBookings() {
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });
  return { bookings, bookingsLoading };
}
