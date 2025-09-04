"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
export default function ConfirmationPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 100 / 3; // 3 seconds -> fill bar
      setProgress(Math.min(value, 100));
    }, 1000);
    const timeout = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Email Verified :tada:</h1>
      <p className="text-gray-600 mb-6">
        Your email has been confirmed successfully.
      </p>
      {/* Progress with countdown */}
      <div className="w-64 mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-500 mt-2">
          Redirecting to login in{" "}
          {Math.ceil((3000 - (progress / 100) * 3000) / 1000)}s...
        </p>
      </div>
      <a
        href="/signin"
        className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
      >
        Continue to Login
      </a>
    </div>
  );
}