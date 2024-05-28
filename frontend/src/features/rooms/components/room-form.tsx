import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDeleteImage from "@/hooks/useDeleteImage";
import useImageUpload from "@/hooks/useImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useCreateRoom from "../hooks/useCreateRoom";
import useUpdateRoom from "../hooks/useUpdateRoom";

const formSchema = z.object({
  room_type: z.string({ message: "Room type is required" }),
  room_number: z.string({ message: "Room number is required" }),
  price: z.coerce.number({ message: "Price is required" }),
  bed_type: z.string({ message: "Bed type is required" }),
  max_capacity: z.coerce.number({ message: "Max capacity is required" }),
  amenities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  room_status: z.string().optional(),
  return_status: z.string().optional(),
  res_status: z.string().optional(),
  fo_status: z.string().optional(),
});

const amenities = [
  "Shower",
  "Safe Box",
  "Luggage",
  "Ocean View",
  "Internet",
  "TV Cable",
  "Refrigerator",
  "Air Conditioning",
  "Concierge",
];

const createRoomSchema = formSchema.omit({
  room_status: true,
  return_status: true,
  res_status: true,
  fo_status: true,
});

export type RoomFormValues = z.input<typeof createRoomSchema>;
export type EditRoomFormValues = z.input<typeof formSchema>;

type Props = {
  setIsOpen: (value: boolean) => void;
  room?: Room;
};

export default function RoomForm({ setIsOpen, room }: Props) {
  const [images, setImages] = useState<string[]>(room ? room.images : []);
  const uploadImageMutation = useImageUpload();
  const updateRoomMutation = useUpdateRoom();
  const deleteImageMutation = useDeleteImage();
  const createRoomMutation = useCreateRoom();

  const form = useForm<EditRoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: room
      ? {
          room_type: room.room_type,
          room_number: room.room_number,
          bed_type: room.bed_type,
          amenities: room.amenities,
          max_capacity: room.max_capacity,
          price: room.price,
          res_status: room.res_status,
          return_status: room.return_status,
          room_status: room.room_status,
          fo_status: room.fo_status,
        }
      : {
          amenities: [
            "Shower",
            "Safe Box",
            "TV Cable",
            "Refrigerator",
            "Air Conditioning",
          ],
        },
  });

  const isPending =
    createRoomMutation.isPending || updateRoomMutation.isPending;

  function onSubmit(values: EditRoomFormValues) {
    if (room) {
      updateRoomMutation.mutate(
        { id: room.id, values, images },
        {
          onSuccess: () => {
            setIsOpen(false);
          },
        }
      );
    } else {
      if (images.length > 0) {
        createRoomMutation.mutate(
          {
            values: {
              room_type: values.room_type,
              room_number: values.room_number,
              bed_type: values.bed_type,
              amenities: values.amenities,
              max_capacity: values.max_capacity,
              price: values.price,
            },
            images,
          },
          {
            onSuccess: () => {
              setIsOpen(false);
            },
          }
        );
      } else {
        toast.error("Upload at least one image");
      }
    }
  }

  const uploadImage = (image: File) => {
    uploadImageMutation.mutate(image, {
      onSuccess(data) {
        setImages((images) => [...images, data.image_url]);
      },
    });
  };

  const deleteImage = (url: string, indexValue: number) => {
    deleteImageMutation.mutate(url, {
      onSuccess: () => {
        const newImages = [...images].filter((_, index) => index != indexValue);
        setImages(newImages);
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 ">
          <Label className="text-lg font-medium">Room Picture</Label>
          <div className="flex gap-2 items-center flex-wrap">
            {images.map((image, index) => (
              <div className="relative">
                <img
                  key={index}
                  src={image}
                  alt="Room Image"
                  width={150}
                  height={100}
                  className="rounded-sm"
                />
                <Button
                  onClick={() => deleteImage(image, index)}
                  size="icon"
                  variant="outline"
                  className="rounded-full absolute right-2 top-1 size-8"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}

            <div>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                id="inputFile"
                onChange={(e) => uploadImage(e.target.files![0])}
              />
              <Label
                htmlFor="inputFile"
                className="border-dashed border rounded-sm w-[150px] h-[100px] flex flex-col justify-center items-center cursor-pointer text-muted-foreground"
              >
                <Plus className="size-6" />
                Add image
              </Label>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-lg font-medium">Room Details</Label>
          <div className="grid grid-cols-5 space-x-3">
            <FormField
              name="room_type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Standard">Standard Room</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Deluxe">Deluxe Room</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="room_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="bed_type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Price</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bed type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Twin Size">Twin Size</SelectItem>
                      <SelectItem value="Double Size">Double Size</SelectItem>
                      <SelectItem value="King Size">King Size</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="max_capacity"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {room && (
            <div className="grid grid-cols-5 space-x-3">
              <FormField
                name="room_status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Clean">Clean</SelectItem>
                        <SelectItem value="Inspected">Inspected</SelectItem>
                        <SelectItem value="Out of service">
                          Out of service
                        </SelectItem>
                        <SelectItem value="Out of order">
                          Out of order
                        </SelectItem>
                        <SelectItem value="Dirty">Dirty</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="return_status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Status</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="res_status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reservation Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reservation status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Not Reserved">
                          Not Reserved
                        </SelectItem>
                        <SelectItem value="Departed">Departed</SelectItem>
                        <SelectItem value="In House">In House</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="fo_status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FO Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fo status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Vacant">Vacant</SelectItem>
                        <SelectItem value="Occupied">Occupied</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-lg font-medium">Room Amenities</Label>
          <FormField
            control={form.control}
            name="amenities"
            render={() => (
              <FormItem className="grid grid-cols-7">
                {amenities.map((amenity) => (
                  <FormField
                    key={amenity}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={amenity}
                          className="flex items-end space-x-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, amenity])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== amenity
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal mt-2">
                            {amenity}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              form.reset();
              setImages([]);
              setIsOpen(false);
            }}
            variant="outline"
            type="button"
          >
            Close
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            className="flex items-center gap-x-2"
          >
            {isPending && <Loader />}
            <Save className="size-4" />
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
