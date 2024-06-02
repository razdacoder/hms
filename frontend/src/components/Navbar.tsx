import useUser from "@/hooks/useUser";
import { Search } from "lucide-react";
import Logo from "./Logo";
import { Input } from "./ui/input";

export default function Navbar() {
  const { user } = useUser();
  return (
    <header className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] h-[70px] pr-8 bg-white">
      <div className="pl-8 my-auto">
        <Logo />
      </div>
      <div className="flex justify-between items-center">
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground bg-muted" />
              <Input
                type="search"
                placeholder="Search here..."
                className="w-full appearance-none bg-muted pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <div>
          <div className="">
            <h6 className="text-sm font-medium">
              {user.user.first_name} {user.user.last_name}
            </h6>
            <p className="text-xs font-light">
              Security Level: {user.user.security_level}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
