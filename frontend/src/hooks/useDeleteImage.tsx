import { deleteImage } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useDeleteImage() {
  const deleteImageMutation = useMutation({
    mutationFn: (url: string) => deleteImage(url),
    onError: () => {
      toast.error("Failed to delete image");
    },
  });
  return deleteImageMutation;
}
