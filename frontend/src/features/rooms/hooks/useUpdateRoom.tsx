import { updateRoom } from "@/api/rooms";
import { EditRoomFormValues } from "@/features/rooms/components/room-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useUpdateRoom() {
  const queryClient = useQueryClient();
  const updateRoomMutation = useMutation({
    mutationFn: (data: {
      id: string;
      values: EditRoomFormValues;
      images: string[];
    }) => updateRoom(data.id, data.values, data.images),
    onSuccess: () => {
      toast.success("Changes saved");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return updateRoomMutation;
}
