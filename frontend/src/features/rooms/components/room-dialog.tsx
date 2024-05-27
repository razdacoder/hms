import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { useState } from "react";
import RoomForm from "./room-form";

export function CreateRoomDialog() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-x-2">
          <Plus className="size-4" />
          Create new room
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Create new room</DialogTitle>
          <DialogDescription>
            Enter room details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <RoomForm />

        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button type="submit" className="flex items-center gap-x-2">
            <Save className="size-4" />
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
