import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/features/bookings/components/columns";
import useBookings from "@/features/bookings/hooks/useBookings";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Booking() {
  const [filter, setFilter] = useState<"all" | "in-house" | "departed">("all");
  const { bookings, bookingsLoading } = useBookings();

  return (
    <main className="px-6">
      <h3 className="text-lg font-medium">Bookings</h3>
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
            All bookings
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("in-house")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "in-house" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            In House
          </Button>
          <Button
            variant="link"
            onClick={() => setFilter("departed")}
            className={cn(
              "hover:no-underline px-0 font-medium text-slate-700",
              filter === "departed" &&
                "underline hover:underline underline-offset-8 text-primary"
            )}
          >
            Departed
          </Button>
        </div>
        <div className="flex gap-x-3 items-center">
          <DatePicker />
          <Button className="flex items-center gap-x-2" asChild>
            <Link to="/bookings/new">
              <Plus className="size-4 " /> Create new booking
            </Link>
          </Button>
        </div>
      </div>
      {bookingsLoading && (
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
      {bookings && (
        <div className="mt-6 bg-white drop-shadow-sm p-4 rounded-md">
          <DataTable columns={columns} data={bookings} />
        </div>
      )}
    </main>
  );
}
