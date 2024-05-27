import { getRooms } from "@/api/rooms";
import { useQuery } from "@tanstack/react-query";

export default function useRooms() {
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  return { rooms, roomsLoading };
}
