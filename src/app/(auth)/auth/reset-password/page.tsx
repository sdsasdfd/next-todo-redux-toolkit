"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Key } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

const ResetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetValues = z.infer<typeof ResetSchema>;

export default function ResetPasswordPage() {
  // optional: capture token from query string for later API call
  const searchParams = useSearchParams();
  // const token = searchParams?.get("code") ?? "";
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const { isDirty, isSubmitting } = form.formState;
  const [show, setShow] = useState({ pwd: false, confirm: false });

    useEffect(() => {
    const code = searchParams.get("code")
    if (code) {
      // Exchange the recovery code for a session
      supabase.auth.exchangeCodeForSession(code).catch((err) =>
        console.error("Error exchanging code:", err)
      )
    }
  }, [searchParams, supabase])

  async function onSubmit(values: ResetValues) {
    // DESIGN ONLY: replace with API call that sends { token, password: values.password }
    // console.log("Reset token:", token);
    console.log("New password payload:", values);

    try {
      const {data: resetData, error} = await supabase.auth.updateUser({password: values.password}) 

      console.log("reset password response", resetData, error)

      if(resetData){
        toast.success("Password reset successful");
        form.reset();
        router.push('/auth/login');
      }

      if(error){
        toast.error(error.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password");
    }

    // try {
    //   const res = await axios.post('/api/reset-password', {password: values.password}) 

    //   if(res.data?.success) {
    //     toast.success(res.data?.message ?? "Password reset successful");
    //     form.reset()
    //     router.push('/auth/login')
    //   }
    // } catch (error) {
    //      if(axios.isAxiosError(error)){
    //     const serverData = error.response?.data
    //     const msg =
    //     serverData?.message ?? `Request failed (${error.response?.status ?? "?"})`;
    //   console.log("axios error response:", error.response);
    //   toast.error(msg);
    // }     else {
    //   console.error("Non-axios error:", error);
    //   toast.error("An unexpected error occurred");
    // }
    // }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5" />
              <CardTitle className="text-lg">Reset password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Create a new password"
                            type={show.pwd ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShow((s) => ({ ...s, pwd: !s.pwd }))}
                            aria-label={show.pwd ? "Hide password" : "Show password"}
                          >
                            {show.pwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">At least 6 characters.</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Re-enter new password"
                            type={show.confirm ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                            aria-label={show.confirm ? "Hide password" : "Show password"}
                          >
                            {show.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting || !isDirty}
                  >
                    Reset
                  </Button>

                  <Button type="submit" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? "Saving..." : "Set new password"}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-3">
                  This link will expire after a short time. If it doesn’t work, request a new reset link.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
