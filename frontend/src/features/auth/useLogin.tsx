import { login } from "@/api/auth";
import { LoginFormValues } from "@/pages/Login";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function useLogin() {
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (data) => {
      toast.success("Login successful");
      localStorage.setItem("token", data.token);
      navigate("/");
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
