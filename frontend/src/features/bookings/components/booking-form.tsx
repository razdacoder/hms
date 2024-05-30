/* eslint-disable react-hooks/exhaustive-deps */
import Loader from "@/components/Loader";
import { SelectRoom } from "@/components/room-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useBookRooms from "../hooks/useBookRooms";
import useCreateBooking from "../hooks/useCreateBooking";

const formSchema = z.object({
  check_in_date: z.coerce.date({ message: "Check in date is required" }),
  duration: z.coerce.number({ message: "Duration is required" }),
  guests_number: z.coerce.number(),
  guest_request: z.string().optional(),
  extras: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  room_id: z.string({ message: "Please select a room" }),
  guest: z.object({
    full_name: z.string({ message: "Guest full name is required" }),
    email: z.string().email({ message: "Guest email is required" }),
    phone_number: z.string({ message: "Guest phone number is required" }),
    address: z.string({ message: "Guest address is required" }),
  }),
});

export type BookingFormValues = z.input<typeof formSchema>;

const extras = ["Breakfast", "Launch", "Dinner", "Spa", "Pool", "Gym"];

export default function BookingForm() {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 1,
      guests_number: 1,
      extras: ["Breakfast"],
      room_id: "",
      check_in_date: new Date(),
      guest_request: "",
      guest: {
        full_name: "",
        email: "",
        phone_number: "",
        address: "",
      },
    },
  });

  function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const [roomType, setRoomType] = useState("Standard");
  const [selectedRoom, setSelectedRoom] = useState<Room>();
  const createBookingMutation = useCreateBooking();

  const bookRoomsQuery = useBookRooms({ room_type: roomType });

  const [duration, setDuration] = useState(1);

  const [extraPrice, setExtraPrice] = useState(2000);

  const getRoomPrice = () => {
    return (selectedRoom?.price as number) * duration || 0;
  };

  const [date, setDate] = useState(new Date());

  const [checkOutDate, setCheckOutDate] = useState(addDays(new Date(), 1));

  const getTotalPrice = () => {
    return getRoomPrice() + extraPrice;
  };

  const getExtraPrice = (values: string[]) => {
    let extra = 0;
    if (values.includes("Breakfast")) {
      extra += 2000;
    }
    if (values.includes("Launch")) {
      extra += 2500;
    }
    if (values.includes("Dinner")) {
      extra += 3000;
    }
    if (values.includes("Spa")) {
      extra += 5000;
    }
    if (values.includes("Pool")) {
      extra += 1000;
    }
    if (values.includes("Gym")) {
      extra += 5000;
    }
    return extra;
  };

  const [checkIn, setCheckIn] = useState(false);

  function onSubmit(values: BookingFormValues) {
    createBookingMutation.mutate({
      values,
      price: getTotalPrice(),
      check_out_date: checkOutDate,
      res_status: checkIn ? "In House" : "",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mt-4 bg-white rounded-sm flex ">
          <div className="w-9/12  p-6 space-y-6">
            <div className="grid grid-cols-3 space-x-6">
              <FormField
                name="check_in_date"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check in date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          if (value) {
                            setDate(value);
                            setCheckOutDate(addDays(value, duration));
                          }
                        }}
                        disabled={field.disabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="duration"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Stay Duration</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isNaN(e.target.valueAsNumber)) {
                            setDuration(e.target.valueAsNumber);
                            setCheckOutDate(
                              addDays(date, e.target.valueAsNumber)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-y-2">
                <Label>Check out date</Label>
                <span className="h-10 text-sm font-medium flex items-center">
                  {format(checkOutDate, "PPP")}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Room Details</h3>
              <div className="grid grid-cols-3 space-x-6">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select
                    defaultValue={roomType}
                    onValueChange={(value) => {
                      setRoomType(value);
                      bookRoomsQuery.refetch();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard Room</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Deluxe">Deluxe Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FormField
                  name="room_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room #</FormLabel>
                      <FormControl>
                        <SelectRoom
                          onChange={(value) => {
                            const room = bookRoomsQuery.data?.find(
                              (room) => room.id === value
                            );
                            setSelectedRoom(room);
                            field.onChange(value);
                          }}
                          disabled={field.disabled || bookRoomsQuery.isLoading}
                          value={field.value}
                          options={bookRoomsQuery.data?.map((room) => ({
                            label: `${roomType.toUpperCase()} ${
                              room.room_number
                            }`,
                            value: room.id,
                          }))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="guests_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of guests</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Guest Details</h3>
              <div className="grid grid-cols-3 space-x-6">
                <FormField
                  name="guest.full_name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="guest.email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="guest.phone_number"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="guest.address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="guest_request"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Comment / Request</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-medium">Extras</Label>
              <FormField
                control={form.control}
                name="extras"
                render={() => (
                  <FormItem className="grid grid-cols-7">
                    {extras.map((extra) => (
                      <FormField
                        key={extra}
                        control={form.control}
                        name="extras"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={extra}
                              className="flex items-end space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  className=" justify-items-center"
                                  disabled={
                                    extra === "Breakfast" || field.disabled
                                  }
                                  checked={field.value?.includes(extra)}
                                  onCheckedChange={(checked) => {
                                    setExtraPrice(
                                      getExtraPrice([...field.value, extra])
                                    );
                                    return checked
                                      ? field.onChange([...field.value, extra])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== extra
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {extra}
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
          </div>
          <div className="w-3/12 bg-muted  p-6">
            <h4 className="text-xl font-medium">Booking Summary</h4>
            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm font-medium">
                  Room Total ({form.getValues("duration").toString()} nights)
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(getRoomPrice())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm font-medium">
                  Extra Person
                </span>
                <span className="text-sm font-semibold">{formatPrice(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm font-medium">
                  Extras
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(extraPrice)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm font-medium">
                  SUBTOTAL
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">TOTAL</span>
                <span className="font-semibold">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </div>
            <div className="items-top flex space-x-2 mt-4 ">
              <Checkbox
                checked={checkIn}
                onCheckedChange={(checked) =>
                  setCheckIn(Boolean(checked.valueOf()))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms1"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Check in
                </Label>
                <p className="text-sm text-muted-foreground">
                  Check the guest in immediately on booking creation.
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-x-3 items-center">
              <Button
                disabled={createBookingMutation.isPending}
                className="w-full"
              >
                {createBookingMutation.isPending && <Loader />} Create booking
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
