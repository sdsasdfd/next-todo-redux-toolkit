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
import { Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const ForgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotValues = z.infer<typeof ForgotSchema>;

export default function ForgotPasswordCard() {
  const form = useForm<ForgotValues>({
    resolver: zodResolver(ForgotSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const { isDirty, isSubmitting } = form.formState;
  const [sent, setSent] = useState(false);

  async function onSubmit(values: ForgotValues) {
    try {
      const res = await axios.post("/api/forgot-password", {
        email: values.email,
      });

      console.log("response from forgot-password API", res.data);

      if (res.data?.success) {
        toast.success(
          res.data?.message ?? "Reset link sent if the email exists"
        );
        setSent(true);
        form.reset();
      }
    } catch (error) {
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
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="border-muted shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle className="text-lg">Forgot password</CardTitle>
          </div>
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
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmitting || sent}
                >
                  {isSubmitting
                    ? "Sending..."
                    : sent
                    ? "Sent"
                    : "Send reset link"}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                We'll send a password reset link to your email if it exists in
                our system.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
