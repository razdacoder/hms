import { LoginFormValues } from "@/pages/Login";
import { api } from "./api";

export const login = async (values: LoginFormValues) => {
  const response = await api.post("/users/login", values);

  if (response.status != 200) {
    throw new Error("Invalid username or password");
  }

  return response.data as { token: string };
};
