import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function BackButton({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(-1)}
      className="flex items-center gap-x-2 hover:no-underline px-0 cursor-pointer text-muted-foreground py-0"
      variant="link"
    >
      {children}
    </Button>
  );
}
