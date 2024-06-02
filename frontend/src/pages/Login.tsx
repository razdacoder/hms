import Loader from "@/components/Loader";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useLogin from "@/features/auth/hooks/useLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

const formSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(1, { message: "Username is required" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password should be 8 characters or more" }),
});

export type LoginFormValues = z.input<typeof formSchema>;

export default function Login() {
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }
  return (
    <main className="grid grid-cols-2 min-h-screen">
      <div className="flex justify-center items-center">
        <Card className="w-[400px] drop-shadow-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to gain access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loginMutation.isPending}
                          placeholder="johndoe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loginMutation.isPending}
                          placeholder="**********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  disabled={loginMutation.isPending}
                  className="w-full flex items-center gap-x-2"
                >
                  {loginMutation.isPending && <Loader />}
                  Login
                </Button>
              </form>
            </Form>

            <div className="mt-4">
              <p className="text-center text-sm">
                Forgot password? Contact your Manager or IT Support
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center items-center bg-primary/20">
        <Logo />
      </div>
    </main>
  );
}
