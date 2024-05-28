import { uploadImage } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useImageUpload() {
  const uploadImageMutation = useMutation({
    mutationFn: (image: File) => uploadImage(image),
    onError: () => {
      toast.error("Failed to upload image");
    },
  });
  return uploadImageMutation;
}
