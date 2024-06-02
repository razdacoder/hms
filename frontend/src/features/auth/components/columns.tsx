import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import UserActions from "./actions";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "first_name",
    header: "First name",
  },

  {
    accessorKey: "last_name",
    header: "Last name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "security_level",
    header: "Security Level",
    cell: ({ row }) => {
      const { security_level } = row.original;
      if (security_level === "1") return <span>Staff</span>;
      if (security_level === "2") return <span>Receptionist</span>;
      if (security_level === "3") return <span>Supervisor</span>;
      if (security_level === "4") return <span>IT / Manager</span>;
      if (security_level === "5") return <span>CEO</span>;
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
          Date Added
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
      const user = row.original;
      return <UserActions user={user} />;
    },
  },
];
