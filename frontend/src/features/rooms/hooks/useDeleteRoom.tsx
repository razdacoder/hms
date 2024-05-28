import { deleteRoom } from "@/api/rooms";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useDeleteRoom() {
  const queryClient = useQueryClient();
  const deleteRoomMutation = useMutation({
    mutationFn: (data: { id: string }) => deleteRoom(data.id),
    onSuccess: () => {
      toast.success("Room Deleted");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return deleteRoomMutation;
}
