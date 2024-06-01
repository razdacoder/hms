import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  Minus,
  Paintbrush,
  ShieldBan,
  ShieldCheck,
  ShieldQuestion,
  ShieldX,
} from "lucide-react";
import RoomActions from "./actions";

const getRoomStatus = (status: string) => {
  if (status === "Clean") {
    return <ShieldCheck className="size-4 text-blue-400" />;
  }
  if (status === "Inspected") {
    return <ShieldQuestion className="size-4 text-green-400" />;
  }
  if (status === "Out of service") {
    return <ShieldX className="size-4 text-slate-400" />;
  }
  if (status === "Out of order") {
    return <ShieldBan className="size-4 text-slate-400" />;
  }
  if (status === "Dirty") {
    return <Paintbrush className="size-4 text-red-400" />;
  }
};

export const columns: ColumnDef<Room>[] = [
  {
    accessorKey: "room_type",
    header: "Room",
  },
  {
    accessorKey: "room_number",
    header: "No.",
  },
  {
    accessorKey: "room_status",
    header: "Room Status",
    cell: ({ row }) => {
      const { room_status } = row.original;

      return (
        <span className="flex items-center gap-x-2">
          {getRoomStatus(room_status)} {room_status}
        </span>
      );
    },
  },
  {
    accessorKey: "return_status",
    header: "Return Status",
    cell: ({ row }) => {
      const { return_status } = row.original;

      return (
        <span className="flex items-center gap-x-2">
          {return_status === "" ? <Minus className="size-4" /> : return_status}
        </span>
      );
    },
  },
  {
    accessorKey: "fo_status",
    header: "FO Status",
  },
  {
    accessorKey: "bed_type",
    header: "Bed Type",
  },
  {
    accessorKey: "max_capacity",
    header: "Max Guests",
    cell: ({ row }) => {
      const { max_capacity } = row.original;
      return <span>{max_capacity} Guests</span>;
    },
  },

  {
    accessorKey: "price",
    header: "Room Price",
    cell: ({ row }) => {
      const { price } = row.original;

      return <span>{formatPrice(price)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const room = row.original;

      return <RoomActions room={room} />;
    },
  },
];
