import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(-1)}
      className="flex items-center gap-x-2"
      variant="outline"
    >
      Close
    </Button>
  );
}
