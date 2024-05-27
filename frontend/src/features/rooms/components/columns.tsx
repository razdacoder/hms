import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  DiscAlbum,
  LogOut,
  Minus,
  MoreVertical,
  Paintbrush,
  ShieldBan,
  ShieldCheck,
  ShieldQuestion,
  ShieldX,
} from "lucide-react";

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

const getResStatus = (status: string) => {
  if (status === "Not Reserved") {
    return <DiscAlbum className="size-4 text-slate-400" />;
  }
  if (status === "Departed") {
    return <LogOut className="size-4 text-blue-400" />;
  }
  if (status === "In House") {
    return <ShieldX className="size-4 text-red-400" />;
  }
};

export const columns: ColumnDef<Room>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "res_status",
    header: "Reservation Status",
    cell: ({ row }) => {
      const { res_status } = row.original;

      return (
        <span className="flex items-center gap-x-2">
          {getResStatus(res_status)} {res_status}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
