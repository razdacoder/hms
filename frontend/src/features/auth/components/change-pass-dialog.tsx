import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useChangePassDialog } from "../hooks/useChangePassDialog";
import useChangePassword from "../hooks/useChnagePassword";

const formSchema = z
  .object({
    new_password: z
      .string({ message: "This field is required" })
      .min(8, { message: "Passwords must be at least 8 characters" }),
    confirm_password: z
      .string({ message: "This field is required" })
      .min(8, { message: "Passwords must be at least 8 characters" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordValues = z.input<typeof formSchema>;

export default function ChangePasswordDialog() {
  const { isOpen, onClose, id } = useChangePassDialog();
  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  function onSubmit(values: ChangePasswordValues) {
    changePasswordMutation.mutate(
      { id: id!, values },
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
          <DialogTitle>Change user password</DialogTitle>
          <DialogDescription>
            Enter new password to change it.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="new_password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={changePasswordMutation.isPending}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirm_password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={changePasswordMutation.isPending}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={changePasswordMutation.isPending}
              className="w-full flex items-center gap-x-2"
            >
              {changePasswordMutation.isPending && <Loader />}
              Change Password
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
