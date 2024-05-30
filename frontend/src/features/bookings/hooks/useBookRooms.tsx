import { getBookingRooms } from "@/api/rooms";
import { useQuery } from "@tanstack/react-query";

type Props = {
  room_type: string;
};

export default function useBookRooms({ room_type }: Props) {
  const bookRoomsQuery = useQuery({
    queryKey: ["book-rooms", room_type],
    queryFn: () => getBookingRooms(room_type),
  });
  return bookRoomsQuery;
}
