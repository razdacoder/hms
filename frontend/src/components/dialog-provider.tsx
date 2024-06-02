import EditUserDialog from "@/features/auth/components/edit-user-dialog";
import NewUserDialog from "@/features/auth/components/new-user-dialog";

export default function DialogProvider() {
  return (
    <>
      <NewUserDialog />
      <EditUserDialog />
    </>
  );
}
