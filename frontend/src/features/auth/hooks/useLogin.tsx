import { login } from "@/api/auth";
import { LoginFormValues } from "@/pages/Login";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useLogin() {
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (data) => {
      toast.success("Login successful");
      localStorage.setItem("user", JSON.stringify(data));
      window.location.replace("/");
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data as {
        error: string;
      };
      toast.error(err.error);
    },
  });
  return loginMutation;
}
