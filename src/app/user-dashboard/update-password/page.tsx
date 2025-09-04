"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Lock } from "lucide-react";
import { de } from "zod/v4/locales";
import axios from "axios";
import { toast } from "sonner";

const PasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export type PasswordFormValues = z.infer<typeof PasswordSchema>;

const UpdatePassword = () => {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isDirty, isSubmitting } = form.formState;

  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  async function onSubmit(values: PasswordFormValues) {
    // DESIGN-ONLY: replace with your API call
    console.log("Password update payload:", values);

   try {
     const res = await axios.post("/api/update-password", values);
 
     console.log("res from update password", res.data);
 
     if (res.data.success === true) {
       toast.success(res.data.message);
       form.reset();
     } else{
         console.log("runn")
         toast.error(res.data.message || "Failed to update password");
     }
   } catch (error :any) {
    if(axios.isAxiosError(error)){
        const serverData = error.response?.data
        const msg =
        serverData?.message ?? `Request failed (${error.response?.status ?? "?"})`;
      console.log("axios error response:", error.response);
      toast.error(msg);
    }     else {
      console.error("Non-axios error:", error);
      toast.error("An unexpected error occurred");
    }
   }
  }
    return (
      <div className="w-full max-w-xl mx-auto p-4">
        <Card className="border-muted shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <CardTitle className="text-xl">Update Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Current Password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={show.current ? "text" : "password"}
                            placeholder="Enter current password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setShow((s) => ({ ...s, current: !s.current }))
                            }
                            aria-label={
                              show.current ? "Hide password" : "Show password"
                            }
                          >
                            {show.current ? (
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

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={show.next ? "text" : "password"}
                            placeholder="Create a new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setShow((s) => ({ ...s, next: !s.next }))
                            }
                            aria-label={
                              show.next ? "Hide password" : "Show password"
                            }
                          >
                            {show.next ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use at least 6 characters. Avoid reusing old passwords.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={show.confirm ? "text" : "password"}
                            placeholder="Re-enter new password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setShow((s) => ({ ...s, confirm: !s.confirm }))
                            }
                            aria-label={
                              show.confirm ? "Hide password" : "Show password"
                            }
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
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  
    );
  
}

export default UpdatePassword;
