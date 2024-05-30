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
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  booking: Booking;
};

export default function BookingActions({ booking }: Props) {
  //   const [isOpen, setIsOpen] = useState(false);
  //   const deleteRoomMutation = useDeleteRoom();
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

          <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
            <Edit className="size-4" /> Edit booking
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              const ok = await confirm();
              if (ok) {
                //   deleteRoomMutation.mutate({ id: room.id });
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
