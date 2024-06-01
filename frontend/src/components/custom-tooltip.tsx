import { Separator } from "./ui/separator";

export default function CustomToolTip({ active, payload }: any) {
  if (!active) return null;
  const hour = payload[0].payload.hour;
  const check_in = payload[0].value;
  const check_out = payload[1].value;
  const reservation = payload[2].value;
  const cancelled = payload[3].value;
  return (
    <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {hour}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <div className="size-1.5 bg-blue-500 rounded-full"></div>
            <p className="text-xs text-muted-foreground">Check in</p>
          </div>
          <p className="text-sm text-right font-medium">{check_in}</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <div className="size-1.5 bg-orange-500 rounded-full"></div>
            <p className="text-xs text-muted-foreground">Check out</p>
          </div>
          <p className="text-sm text-right font-medium">{check_out}</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <div className="size-1.5 bg-primary rounded-full"></div>
            <p className="text-xs text-muted-foreground">Reservation</p>
          </div>
          <p className="text-sm text-right font-medium">{reservation}</p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <div className="size-1.5 bg-rose-500 rounded-full"></div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </div>
          <p className="text-sm text-right font-medium">{cancelled}</p>
        </div>
      </div>
    </div>
  );
}
