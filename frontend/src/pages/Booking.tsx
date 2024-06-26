import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/features/bookings/components/columns";
import useBookings from "@/features/bookings/hooks/useBookings";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Booking() {
  const [filter, setFilter] = useState<
    "all" | "in-house" | "departed" | "reservation" | "cancelled"
  >("all");
  const { bookings, bookingsLoading } = useBookings();

  const [searchValue, setSearchValue] = useState("");

  const filteredBookings = () => {
    if (filter === "all") return bookings;
    if (filter === "in-house") {
      return bookings?.filter(
        (booking) => booking.booking_status === "CheckedIn"
      );
    }
    if (filter === "departed") {
      return bookings?.filter(
        (booking) => booking.booking_status === "CheckedOut"
      );
    }
    if (filter === "reservation") {
      return bookings?.filter(
        (booking) => booking.booking_status === "Reservation"
      );
    }
    if (filter === "cancelled") {
      return bookings?.filter(
        (booking) => booking.booking_status === "Cancelled"
      );
    }
  };

  const searchBookings = (bookings: Booking[]): Booking[] => {
    if (searchValue != "") {
      return bookings.filter(
        (booking) =>
          booking.guest.full_name
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          booking.guest.email.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return bookings;
  };

  return (
    <main className="px-6">
      <h3 className="text-lg font-medium">Bookings</h3>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
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
            <Button
              variant="link"
              onClick={() => setFilter("reservation")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "reservation" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              Reservation
            </Button>
            <Button
              variant="link"
              onClick={() => setFilter("cancelled")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "cancelled" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              Cancelled
            </Button>
          </div>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by guest name or email"
          />
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
          <DataTable
            columns={columns}
            data={searchBookings(filteredBookings() as Booking[])}
          />
        </div>
      )}
    </main>
  );
}
