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
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import //   selectError,
//   selectLoading,
//   selectUser,
//   signup,
"@/lib/store/features/authSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
  fullname: z.string().min(2, { message: "Fullname is required" }),
  email: z.email().min(1, { message: "email is required" }),
  password: z
    .string()
    .min(7, { message: "password should be at least 7 characters" }),
});

export default function SignupPage() {
    const [loading, setLoading] = useState(false);
  const router = useRouter();
  //   const dispatch = useAppDispatch();
  //   const loading = useAppSelector(selectLoading);
  //   const error = useAppSelector(selectError);
  //   const user = useAppSelector(selectUser);

  //   console.log("User", user);
  //   console.log("loading", loading);
  //   console.log("error", error);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setLoading(true)
    const result = await signup(values);
    if(result.success){
    console.log("result", result);
    const paymentLink = localStorage.getItem("paymentLink")

    router.push(paymentLink + `?locked_prefilled_email=${result?.data}`)
    localStorage.removeItem('paymentLink')

    // const res = await axios.post('/api/create-checkout-session', {

    // })

    }else if(!result.success){
      router.push('/')
    }
    // await dispatch(signup(values));
  };



  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                // disabled={loading}
              >
                
                Create Account
              
              </Button>
            </form>
          </Form>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
