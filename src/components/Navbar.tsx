"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearUser, setUser } from "@/lib/store/features/authSlice";
import { useUserData } from "@/hooks/useUserData";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { signout } from "@/app/actions/auth";
import { toast } from "sonner";
export default function Navbar() {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  // useUserData();

  const userData = useSelector((state: RootState) => state.auth.user);

  console.log("userData", userData);

  console.log("User name", userData?.full_name);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await signout();
      if (res.success) {
        toast.success(res.message);
        router.replace("/auth/login");
        dispatch(clearUser());
      } else {
        toast.error(res.message || "Logout failed");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }finally{
      setLoading(false);
    }
  };
  return (
    <nav className="w-full shadow-sm border-b bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">

          <Link rel="noopener noreferrer" href={process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL!}
          target="_blank" className="text-sm font-medium">
            Billing Portal
          </Link>
          <Link href="/user-dashboard/profile" className="text-sm font-medium">
            {userData?.full_name}
          </Link>
        
  <Link href="/video-upload" className="text-sm font-medium">
            Video
          </Link>
          
          {/* Auth Button (design only) */}
          
            <Button
              className=" cursor-pointer"
              onClick={handleLogout}
              variant="destructive"
            >
              {loading ? "Loading..." : "Sign out"}
            </Button>
         
        </div>
      </div>
    </nav>
  );
}
