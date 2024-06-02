import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Edit2Icon, MoreVertical, Trash2 } from "lucide-react";
import { useChangePassDialog } from "../hooks/useChangePassDialog";
import { useEditUserDialog } from "../hooks/useEditDialog";

type Props = {
  user: User;
};

export default function UserActions({ user }: Props) {
  const { onOpen } = useEditUserDialog();
  const { onOpen: openPass } = useChangePassDialog();
  //   const [ConfirmationDialog, confirm] = useConfirm(
  //     "Are you sure?",
  //     "This will delete this room from the database."
  //   );
  return (
    <>
      {/* <ConfirmationDialog /> */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onOpen(user)}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Edit className="size-4" /> Edit User Info
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => openPass(user.id)}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Edit2Icon className="size-4" /> Change User Password
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            // onClick={async () => {
            //   //   const ok = await confirm();
            // }}
            className="flex gap-x-2 items-center cursor-pointer"
          >
            <Trash2 className="size-4" /> Delete {user.username}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
