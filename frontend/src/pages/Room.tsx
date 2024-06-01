import { getRooms } from "@/api/rooms";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/features/rooms/components/columns";
import { RoomDialog } from "@/features/rooms/components/room-dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Room() {
  const [filter, setFilter] = useState<
    "all" | "available" | "sold" | "Dirty" | "Out of service"
  >("all");
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  const filteredRooms = () => {
    if (filter === "all") return rooms;
    if (filter === "available") {
      return rooms?.filter(
        (room) =>
          room.return_status === "Ready" &&
          room.room_status === "Clean" &&
          room.fo_status === "Vacant"
      );
    }
    if (filter === "sold") {
      return rooms?.filter((room) => room.fo_status === "Occupied");
    }
    if (filter === "Dirty") {
      return rooms?.filter((room) => room.room_status === "Dirty");
    }
    if (filter === "Out of service") {
      return rooms?.filter((room) => room.room_status === "Out of service");
    }
  };

  return (
    <main className="px-6">
      <h3 className="text-lg font-medium">Room</h3>
      <div className="flex items-center justify-between">
        <div className="space-x-6">
          <Button
            variant="link"
            onClick={() => setFilter("all")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "all" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            All Rooms
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("available")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "available" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            Available
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("sold")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "sold" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            Booked
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("Dirty")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "Dirty" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            Dirty
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("Out of service")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "Out of service" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            Out of Service
          </Button>
        </div>
        <div className="flex gap-x-3 items-center">
          <RoomDialog />
        </div>
      </div>
      {roomsLoading && (
        <div className="mt-4 bg-white drop-shadow-sm p-4 space-y-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="grid grid-cols-7">
              <Skeleton className="size-4" />
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-24 h-8" />
              <Skeleton className="w-24 h-8" />
            </div>
          ))}
        </div>
      )}
      {rooms && (
        <div className="mt-6 bg-white drop-shadow-sm p-4 rounded-md">
          <DataTable columns={columns} data={filteredRooms() as Room[]} />
        </div>
      )}
    </main>
  );
}
