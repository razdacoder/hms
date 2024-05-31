import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DiscAlbum, LogInIcon, LogOut } from "lucide-react";
import BookingActions from "./booking-actions";

const getResStatus = (status: string) => {
  if (status === "Reservation") {
    return <DiscAlbum className="size-4 text-slate-400" />;
  }
  if (status === "CheckedOut") {
    return <LogOut className="size-4 text-red-400" />;
  }
  if (status === "CheckedIn") {
    return <LogInIcon className="size-4 text-blue-400" />;
  }
  if (status === "Cancelled") {
    return <DiscAlbum className="size-4 text-red-400" />;
  }
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "guest.full_name",
    header: "Guest Name",
  },
  {
    accessorKey: "room.room_type",
    header: "Room",
  },
  {
    accessorKey: "room.room_number",
    header: "No.",
  },
  {
    accessorKey: "check_in_date",
    header: "Check in",
    cell: ({ row }) => {
      const { check_in_date } = row.original;
      return <span>{format(check_in_date, "eee, d MMM yyyy")}</span>;
    },
  },
  {
    accessorKey: "check_out_date",
    header: "Check out",
    cell: ({ row }) => {
      const { check_out_date } = row.original;
      return <span>{format(check_out_date, "eee, d MMM yyyy")}</span>;
    },
  },
  {
    accessorKey: "guest_request",
    header: "Guest",
    cell: ({ row }) => {
      const { guests_number } = row.original;
      return (
        <span>
          {guests_number} {guests_number > 1 ? "Persons" : "Person"}
        </span>
      );
    },
  },
  {
    accessorKey: "booking_status",
    header: "Booking Status",
    cell: ({ row }) => {
      const { booking_status } = row.original;

      return (
        <span className="flex items-center gap-x-2">
          {getResStatus(booking_status)} {booking_status}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Bill",
    cell: ({ row }) => {
      const { price } = row.original;
      return <span>{formatPrice(price)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      return <BookingActions booking={booking} />;
    },
  },
];
