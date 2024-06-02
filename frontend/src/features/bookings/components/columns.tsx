import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, DiscAlbum, LogInIcon, LogOut } from "lucide-react";
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
    header: "Guest Info",
    cell: ({ row }) => {
      const { guest } = row.original;
      return (
        <div className="flex flex-col gap-y-1">
          <span className="text-slate-600 font-semibold">
            {guest.full_name}
          </span>
          <span className="text-muted-foreground">{guest.email}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "room.room_type",
    header: "Room Type",
  },
  {
    accessorKey: "room.room_number",
    header: "Room No.",
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
    accessorKey: "guests_number",
    header: "Total Guest",
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
    header: "Total Bill",
    cell: ({ row }) => {
      const { price } = row.original;
      return <span>{formatPrice(price)}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booked at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { created_at } = row.original;
      return <span>{format(created_at, "eee, d MMM yyyy")}</span>;
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
