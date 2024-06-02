import { createUser } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { NewUserFormValues } from "../components/new-user-dialog";

export default function useCreateUser() {
  const queryClient = useQueryClient();
  const createUserMutation = useMutation({
    mutationFn: (values: NewUserFormValues) => createUser(values),
    onSuccess: () => {
      toast.success("User created");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return createUserMutation;
}
