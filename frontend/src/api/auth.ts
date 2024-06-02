import { EditUserFormValues } from "@/features/auth/components/edit-user-dialog";
import { NewUserFormValues } from "@/features/auth/components/new-user-dialog";
import { LoginFormValues } from "@/pages/Login";
import { api } from "./api";

export const login = async (values: LoginFormValues) => {
  const response = await api.post("/users/login", values);

  if (response.status != 200) {
    throw new Error("Invalid username or password");
  }

  return response.data as { token: string; user: User };
};

export const getUsers = async () => {
  const response = await api.get("/users");
  if (response.status != 200) {
    throw new Error("Failed to get users");
  }
  return response.data as User[];
};

export const createUser = async (values: NewUserFormValues) => {
  const response = await api.post("/users", values);
  if (response.status != 201) {
    throw new Error("Could not create user");
  }
  return response.data;
};

export const updateUser = async (id: string, values: EditUserFormValues) => {
  const response = await api.patch(`/users/${id}`, values);
  if (response.status != 201) {
    throw new Error("Could not update user");
  }
  return response.data;
};
