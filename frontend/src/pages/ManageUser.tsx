import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/features/auth/components/columns";
import { useNewUser } from "@/features/auth/hooks/useCreateDialog";
import useGetUsers from "@/features/auth/hooks/useGetUsers";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ManageUsers() {
  const [filter, setFilter] = useState<
    "all" | "it-manager" | "Supervisor" | "Receptionist" | "Staff"
  >("all");
  const { users, usersLoading } = useGetUsers();
  const [searchValue, setSearchValue] = useState("");
  const { onOpen } = useNewUser();
  return (
    <main className="px-6">
      <h3 className="text-lg font-medium">Manage Users</h3>
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
              All users
            </Button>
            <Button
              variant="link"
              onClick={() => setFilter("it-manager")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "it-manager" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              IT / Manager
            </Button>
            <Button
              variant="link"
              onClick={() => setFilter("Supervisor")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "Supervisor" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              Supervisor
            </Button>
            <Button
              variant="link"
              onClick={() => setFilter("Receptionist")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "Receptionist" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              Receptionist
            </Button>
            <Button
              variant="link"
              onClick={() => setFilter("Staff")}
              className={cn(
                "hover:no-underline px-0 font-medium text-slate-700",
                filter === "Staff" &&
                  "underline hover:underline underline-offset-8 text-primary"
              )}
            >
              Other
            </Button>
          </div>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by guest name or email"
          />
        </div>

        <div className="flex gap-x-3 items-center">
          <Button onClick={onOpen} className="flex items-center gap-x-2">
            <Plus className="size-4 " /> Add new user
          </Button>
        </div>
      </div>
      {usersLoading && (
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
      {users && (
        <div className="mt-6 bg-white drop-shadow-sm p-4 rounded-md">
          <DataTable columns={columns} data={users} />
        </div>
      )}
    </main>
  );
}
