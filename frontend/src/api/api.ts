import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const uploadImage = async (image: File) => {
  const response = await api.post(
    "/upload",
    { image },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (response.status != 200) {
    throw new Error("Failed to upload image");
  }

  return response.data as {
    image_url: string;
  };
};

export const deleteImage = async (url: string) => {
  const response = await api.delete(`/delete-file?url=${url}`);
  if (response.status != 200) {
    throw new Error("Failed to delete image");
  }

  return response.data;
};
