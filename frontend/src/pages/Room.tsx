import { getRooms } from "@/api/rooms";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/features/rooms/components/columns";
import { CreateRoomDialog } from "@/features/rooms/components/room-dialog";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useState } from "react";

export default function Room() {
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

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
            Sold out
          </Button>
        </div>
        <div className="flex gap-x-3 items-center">
          <Button variant="outline" className="flex items-center gap-x-2">
            <Filter className="size-4" />
            Filter
          </Button>
          <CreateRoomDialog />
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
        <div className="mt-4 bg-white drop-shadow-sm p-4">
          <DataTable columns={columns} data={rooms} />
        </div>
      )}
    </main>
  );
}
