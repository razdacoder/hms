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
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Calendar, Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import RoomForm from "./room-form";

type Props = {
  room: Room;
};

export default function RoomActions({ room }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
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
            onClick={() => navigator.clipboard.writeText(room.id)}
          >
            <Calendar className="size-4" /> Book room
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
              <Edit className="size-4" /> Edit room
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-x-2 items-center cursor-pointer">
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
  );
}
