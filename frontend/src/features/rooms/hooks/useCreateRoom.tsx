import { createRoom } from "@/api/rooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { RoomFormValues } from "../components/room-form";

export default function useCreateRoom() {
  const queryClient = useQueryClient();
  const createRoomMutation = useMutation({
    mutationFn: (data: { values: RoomFormValues; images: string[] }) =>
      createRoom(data.values, data.images),
    onSuccess: () => {
      toast.success("Room Created");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return createRoomMutation;
}
