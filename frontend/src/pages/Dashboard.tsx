import AreaVariant from "@/components/AreaChart";
import Loader from "@/components/Loader";
import PieVariant from "@/components/PieChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import useStats from "@/hooks/useStats";
import { format } from "date-fns";
import {
  BedDouble,
  Calendar,
  CalendarCheck2,
  LogInIcon,
  LogOutIcon,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [date, setDate] = useState<Date | undefined>();
  const { stats, statsLoading } = useStats({
    date: date ? format(date, "yyyy-MM-dd") : undefined,
  });

  if (statsLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  return (
    <main className="px-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Home</h3>
          <div className="flex items-center justify-between">
            <div className="space-x-6 flex items-end gap-x-3">
              <h2 className="text-3xl font-medium">Horizon Hotel</h2>
              <p className="text-sm font-medium text-muted-foreground">
                {!date || date === new Date()
                  ? "Today"
                  : format(date, "eee, d MMM yyyy")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <DatePicker
            value={date}
            onChange={(value) => {
              setDate(value);
            }}
          />
          <Button className="flex items-center gap-x-2" asChild>
            <Link to="/bookings/new">
              <Plus className="size-4 " /> Create new booking
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-6 space-x-4 mt-4">
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-slate-500/10 rounded-sm">
              <Calendar className="size-4 text-slate-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Bookings</h6>
              <h2 className="text-2xl font-semibold">{stats?.new_bookings}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-yellow-500/10 rounded-sm">
              <BedDouble className="size-4 text-yellow-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Available Rooms</h6>
              <h2 className="text-2xl font-semibold">
                {stats?.available_rooms}
              </h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-blue-500/10 rounded-sm">
              <LogInIcon className="size-4 text-blue-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Check In</h6>
              <h2 className="text-2xl font-semibold">{stats?.check_ins}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-orange-500/10 rounded-sm">
              <LogOutIcon className="size-4 text-orange-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Check Out</h6>
              <h2 className="text-2xl font-semibold">{stats?.check_outs}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-green-500/10 rounded-sm">
              <CalendarCheck2 className="size-4 text-green-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Reservations</h6>
              <h2 className="text-2xl font-semibold">{stats?.reservations}</h2>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex gap-x-4 items-center py-3">
            <div className="p-3 bg-red-500/10 rounded-sm">
              <X className="size-4 text-red-500" />
            </div>
            <div className="space-y-1">
              <h6 className="text-sm font-medium">Cancelled</h6>
              <h2 className="text-2xl font-semibold">{stats?.cancelled}</h2>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-x-6 mt-4">
        <div className="w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>Front Desk</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaVariant data={stats?.data as ChartData[]} />
            </CardContent>
          </Card>
        </div>
        <div className="w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Housekeeping</CardTitle>
            </CardHeader>
            <CardContent>
              <PieVariant data={stats?.pieData as PieData[]} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
