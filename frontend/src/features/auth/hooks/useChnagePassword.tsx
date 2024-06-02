import { changePassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ChangePasswordValues } from "../components/change-pass-dialog";

export default function useChangePassword() {
  const changePasswordMutation = useMutation({
    mutationFn: (data: { id: string; values: ChangePasswordValues }) =>
      changePassword(data.id, data.values),
    onSuccess: () => {
      toast.success("Password Changed");
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as { error: string };
      toast.error(err.error);
    },
  });
  return changePasswordMutation;
}
