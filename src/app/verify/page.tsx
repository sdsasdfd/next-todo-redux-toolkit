"use client";
import ConfirmationPage from "@/components/ui/Comformation";
import { XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const Verify = () => {
  const params = useSearchParams();

  const status = params.get("status");

  if (status) {
    return <ConfirmationPage />;
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Verification Failed ❌</h1>
      <p className="text-gray-600">Please request a new verification link.</p>
      <a
        href="/signin"
        className="px-6 py-2 mt-6 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
      >
        Back to Login
      </a>
    </div>
  );
};

export default Verify;
