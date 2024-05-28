import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CalendarCheck, Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useDeleteRoom from "../hooks/useDeleteRoom";
import RoomForm from "./room-form";

type Props = {
  room: Room;
};

export default function RoomActions({ room }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteRoomMutation = useDeleteRoom();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will delete this room from the database."
  );
  return (
    <>
      <ConfirmationDialog />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              className="flex gap-x-2 items-center cursor-pointer"
              onClick={() => toast.info("Room Booked")}
            >
              <CalendarCheck className="size-4" /> Book room
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
                <Edit className="size-4" /> Edit room
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                const ok = await confirm();
                if (ok) {
                  deleteRoomMutation.mutate({ id: room.id });
                }
              }}
              className="flex gap-x-2 items-center cursor-pointer"
            >
              <Trash2 className="size-4" /> Delete room
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className=" max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>
              {room.room_type} - {room.room_number}
            </DialogTitle>
            <DialogDescription>
              Edit room details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <RoomForm setIsOpen={(value) => setIsOpen(value)} room={room} />
        </DialogContent>
      </Dialog>
    </>
  );
}
