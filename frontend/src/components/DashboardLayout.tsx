import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className=" min-h-screen flex flex-col">
      <Navbar />
      <div className="grid w-full flex-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-primary/10 pt-8 pb-4">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
