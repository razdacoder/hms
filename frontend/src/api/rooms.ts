import { api } from "./api";

export const getRooms = async () => {
  const response = await api.get("/rooms");
  if (response.status != 200) {
    throw new Error("Failed to fetch rooms");
  }
  return response.data as Room[];
};
