"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch } from "@/lib/store/hooks";
import { login, SignInWithGoogle } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
// import { login } from "@/lib/store/features/authSlice";

const formSchema = z.object({
  email: z.email().min(1, { message: "email is required" }),
  password: z.string().min(2, { message: "password is required" }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //   const dispatch = useAppDispatch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    const result = await login({
      email: values.email,
      password: values.password,
    });

    console.log("result", result);

    if (result.success) {
      toast.success(result.message);
      if(result.role === "admin") {
       return router.push("/admin-dashboard");
      }
      else {
        return router.push("/user-dashboard");
      }
    } else {
      toast.error(result.message);
    }

    // dispatch(login(values));
  };
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Email" {...field} />
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
                      <Input type="text" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-cyan-600 hover:bg-cyan-600 cursor-pointer"
                type="submit"
              >
                Login
              </Button>
            </form>
          </Form>
          <Link href='/auth/forgot-password'>
          <Button variant="link" className=" text-blue-800 hover:text-blue-700">Forgot Password</Button>
          </Link>

          <Button className="bg-blue-600 hover:bg-blue-700 mt-4" onClick={()=>SignInWithGoogle()} >Login with Google</Button>
          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
