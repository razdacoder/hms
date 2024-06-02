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
import { useNewUser } from "../hooks/useCreateDialog";
import useCreateUser from "../hooks/useCreateUser";

const formSchema = z.object({
  first_name: z.string({ message: "Firstname is required" }),
  last_name: z.string({ message: "Lastname is required" }),
  username: z.string({ message: "Username is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  security_level: z.string({ message: "Security level is required" }),
});

export type NewUserFormValues = z.input<typeof formSchema>;

export default function NewUserDialog() {
  const { isOpen, onClose } = useNewUser();
  const createUserMutation = useCreateUser();
  const form = useForm<NewUserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  function onSubmit(values: NewUserFormValues) {
    createUserMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>Enter details fro new user</DialogDescription>
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
                    <Input disabled={createUserMutation.isPending} {...field} />
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
                    <Input disabled={createUserMutation.isPending} {...field} />
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
                    <Input disabled={createUserMutation.isPending} {...field} />
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
                    disabled={createUserMutation.isPending}
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
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={createUserMutation.isPending}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={createUserMutation.isPending}
              className="w-full flex items-center gap-x-2"
            >
              {createUserMutation.isPending && <Loader />}
              Create user
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
