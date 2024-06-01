import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/hooks/useConfirm";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Check, ChevronLeft, Plus, Printer } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useBooking from "../hooks/useBooking";
import useCancelBooking from "../hooks/useCancelBooking";
import useCheckIn from "../hooks/useCheckIn";
import useCheckOut from "../hooks/useCheckOut";
import useDeleteBooking from "../hooks/useDeleteBooking";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, bookingLoading } = useBooking({ id: id! });
  const checkInMutation = useCheckIn({ id: id! });
  const checkOutMutation = useCheckOut({ id: id! });
  const cancelBookingMutation = useCancelBooking({ id: id! });
  const bookingDeleteMutation = useDeleteBooking();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete this room from the database."
  );

  if (bookingLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  const disabled =
    checkInMutation.isPending ||
    checkOutMutation.isPending ||
    cancelBookingMutation.isPending;
  return (
    <main className="px-6">
      <ConfirmationDialog />
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-muted-foreground">Booking Detail</h3>
          <div className="flex items-center gap-x-3">
            <BackButton>
              <ChevronLeft className="size-4" />
            </BackButton>
            <h2 className="text-2xl font-medium">{booking?.guest.full_name}</h2>
          </div>
        </div>

        <Button className="flex items-center gap-x-2" asChild>
          <Link to="/bookings/new">
            <Plus className="size-4 " /> Create new booking
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-sm mt-4">
        <div className="p-6 flex gap-x-12">
          <div className="w-3/12 space-y-4">
            <img
              src={booking?.room.images[0]}
              height={300}
              className="rounded-sm w-full"
            />
          </div>
          <div className="w-9/12">
            <div className="flex justify-between items-center">
              <div className="flex gap-x-3 items-center">
                <h3 className="text-xl font-medium">
                  {booking?.guest.full_name}
                </h3>
                {booking?.booking_status === "CheckedIn" && (
                  <Badge className="bg-blue-500 hover:bg-blue-500">
                    Checked In
                  </Badge>
                )}
                {booking?.booking_status === "CheckedOut" && (
                  <Badge className="bg-orange-500 hover:bg-orange-500">
                    Checked Out
                  </Badge>
                )}
                {booking?.booking_status === "Reservation" && (
                  <Badge>Reservation</Badge>
                )}
                {booking?.booking_status === "Cancelled" && (
                  <Badge variant="destructive">Cancelled</Badge>
                )}
              </div>

              <Button variant="ghost" size="icon">
                <Printer className="size-4" />
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Check in</h4>
                <span className="text-muted-foreground">
                  {format(booking?.check_in_date as Date, "eee, d MMM yyyy")}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Check out</h4>
                <span className="text-muted-foreground">
                  {format(booking?.check_out_date as Date, "eee, d MMM yyyy")}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Room type</h4>
                <span className="text-muted-foreground">
                  {booking?.room.room_type}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Room No.</h4>
                <span className="text-muted-foreground">
                  {booking?.room.room_number}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Guest</h4>
                <span className="text-muted-foreground">
                  {booking?.guests_number}{" "}
                  {(booking?.guests_number as number) > 1
                    ? "Persons"
                    : "Person"}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Guest Email</h4>
                <span className="text-muted-foreground">
                  {booking?.guest.email}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Guest Phone Number</h4>
                <span className="text-muted-foreground">
                  {booking?.guest.phone_number}
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Guest Address</h4>
                <span className="text-muted-foreground text-balance">
                  {booking?.guest.address}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Guest Comment / Request</h4>
                <span className="text-muted-foreground text-balance">
                  {booking?.guest_request}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Extras</h4>
                <div className="flex items-center gap-x-6">
                  {booking?.extras.map((extra) => (
                    <div key={extra} className="flex items-center gap-x-2">
                      <Check className="text-primary size-4" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {extra}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="space-y-2">
                <span className="text-3xl font-bold text-destructive">
                  {formatPrice(booking?.price as number)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="bg-white p-6">
          {booking?.booking_status != "Cancelled" ? (
            <div className="flex justify-between items-center">
              <Button
                disabled={disabled || booking?.booking_status != "Reservation"}
                className="flex gap-x-2 items-center"
                variant="destructive"
                onClick={() => cancelBookingMutation.mutate()}
              >
                {cancelBookingMutation.isPending && <Loader />}
                Cancel Booking
              </Button>
              <div className="flex items-center gap-x-2">
                <Button
                  onClick={async () => {
                    const ok = await confirm();
                    if (ok) {
                      bookingDeleteMutation.mutate(id!, {
                        onSuccess: () => {
                          navigate("/bookings");
                        },
                      });
                    }
                  }}
                  disabled={disabled}
                  variant="secondary"
                >
                  Delete Booking
                </Button>
                {booking?.booking_status == "CheckedIn" && (
                  <Button
                    className="flex gap-x-2 items-center"
                    disabled={disabled}
                    onClick={() => checkOutMutation.mutate()}
                  >
                    {checkOutMutation.isPending && <Loader />}
                    Check Out Booking
                  </Button>
                )}
                {booking?.booking_status === "Reservation" && (
                  <Button
                    className="flex gap-x-2 items-center"
                    disabled={disabled}
                    onClick={() => checkInMutation.mutate()}
                  >
                    {checkInMutation.isPending && <Loader />}
                    Check In Booking
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-red-500 font-medium text-lg">
                This booking has been cancelled
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
