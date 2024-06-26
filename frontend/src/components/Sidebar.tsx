import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  Calendar,
  Home,
  LogOut,
  LucideIcon,
  UserCogIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

type SidebarLink = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type Props = {
  link: SidebarLink;
  active: boolean;
};

function SidebarItem({ active, link }: Props) {
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-6 py-3 text-slate-600 transition-all hover:text-primary mx-8",
        active &&
          "bg-primary text-primary-foreground drop-shadow-md hover:text-primary-foreground hover:opacity-80"
      )}
    >
      <link.icon className="h-4 w-4" />
      {link.title}
    </Link>
  );
}

const routes: SidebarLink[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Room",
    href: "/rooms",
    icon: BedDouble,
  },

  {
    title: "Booking",
    href: "/bookings",
    icon: Calendar,
  },
  {
    title: "Manage Users",
    href: "/manage-users",
    icon: UserCogIcon,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useUser();
  return (
    <div className="">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className=" text-sm font-medium space-y-4">
            {routes.map((route) => {
              const isActive =
                route.href === "/"
                  ? pathname === route.href
                  : pathname.startsWith(route.href);

              if (
                parseInt(user.user.security_level) <= 4 &&
                route.href === "/manage-users"
              ) {
                return null;
              }
              return (
                <SidebarItem key={route.title} active={isActive} link={route} />
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="link"
            className="flex gap-x-2 items-center hover:no-underline text-muted-foreground "
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
