import { updateUser } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { EditUserFormValues } from "../components/edit-user-dialog";

export default function useEditUser() {
  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationFn: (data: { id: string; values: EditUserFormValues }) =>
      updateUser(data.id, data.values),
    onSuccess: () => {
      toast.success("User Updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return editUserMutation;
}
