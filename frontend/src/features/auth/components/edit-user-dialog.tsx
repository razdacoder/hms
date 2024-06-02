import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditUserDialog } from "../hooks/useEditDialog";
import useEditUser from "../hooks/useEditUser";

const formSchema = z.object({
  first_name: z.string({ message: "Firstname is required" }),
  last_name: z.string({ message: "Lastname is required" }),
  username: z.string({ message: "Username is required" }),
  security_level: z.string({ message: "Security level is required" }),
});

export type EditUserFormValues = z.input<typeof formSchema>;

export default function EditUserDialog() {
  const { isOpen, onClose, user } = useEditUserDialog();
  const editUserMutation = useEditUser();
  const isPending = editUserMutation.isPending;

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      security_level: user?.security_level,
    },
  });
  function onSubmit(values: EditUserFormValues) {
    editUserMutation.mutate(
      { id: user?.id as string, values },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {user?.first_name} info</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="first_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="last_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="security_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Level</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="4">IT / Manager</SelectItem>
                      <SelectItem value="3">Supervisor</SelectItem>
                      <SelectItem value="2">Receptionist</SelectItem>
                      <SelectItem value="1">Other Working Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending}
              className="w-full flex items-center gap-x-2"
            >
              {editUserMutation.isPending && <Loader />}
              Update user
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
