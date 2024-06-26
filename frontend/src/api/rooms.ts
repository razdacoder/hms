import {
  EditRoomFormValues,
  RoomFormValues,
} from "@/features/rooms/components/room-form";
import { api } from "./api";

export const getRooms = async () => {
  const response = await api.get("/rooms");
  if (response.status != 200) {
    throw new Error("Failed to fetch rooms");
  }
  return response.data as Room[];
};

export const createRoom = async (values: RoomFormValues, images: string[]) => {
  const response = await api.post("/rooms", { ...values, images });
  if (response.status != 201) {
    throw new Error("Failed to create room");
  }
  return response.data;
};

export const updateRoom = async (
  id: string,
  values: EditRoomFormValues,
  images: string[]
) => {
  const response = await api.patch(`/rooms/${id}`, { ...values, images });
  if (response.status != 200) {
    throw new Error("Failed to update room");
  }
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await api.delete(`/rooms/${id}`);
  if (response.status != 200) {
    throw new Error("Failed to delete room");
  }
  return response.data;
};

export const getBookingRooms = async (room_type: string) => {
  const response = await api.get(`/rooms/book?room_type=${room_type}`);
  if (response.status != 200) {
    throw new Error("Failed to fetch rooms");
  }
  return response.data as Room[];
};
