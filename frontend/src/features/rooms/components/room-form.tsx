import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  room_type: z.string({ message: "Room type is required" }),
  room_number: z.string({ message: "Room number is required" }),
  price: z.number({ message: "Price is required" }),
  bed_type: z.string({ message: "Bed type is required" }),
  max_capacity: z.number({ message: "Max capacity is required" }),
  amenities: z.string().array(),
  images: z.array(z.string()),
});

export type RoomFormValues = z.input<typeof formSchema>;

export default function RoomForm() {
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: [],
    },
  });

  function onSubmit(values: RoomFormValues) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 ">
          <Label className="text-lg font-medium">Room Picture</Label>
          <div className="flex gap-2 items-center flex-wrap">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.name}
                alt="Room Image"
                width={150}
                height={100}
                className="rounded-sm"
              />
            ))}

            <div>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                id="inputFile"
                onChange={() => append("/image.png")}
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
      </form>
    </Form>
  );
}
