import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";
import { Eye, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import useDeleteBooking from "../hooks/useDeleteBooking";

type Props = {
  booking: Booking;
};

export default function BookingActions({ booking }: Props) {
  const bookingDeleteMutation = useDeleteBooking();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete this room from the database."
  );
  return (
    <>
      <ConfirmationDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            asChild
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Link to={`/bookings/${booking.id}`}>
              <Eye className="size-4" /> View booking
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled={
              bookingDeleteMutation.isPending ||
              booking.booking_status === "Cancelled"
            }
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                bookingDeleteMutation.mutate(booking.id);
              }
            }}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Trash2 className="size-4" /> Delete booking
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
