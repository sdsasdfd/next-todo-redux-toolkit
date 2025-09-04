import { clearUser, setUser } from "@/lib/store/features/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export const useUserData = () => {
  const dispatch = useAppDispatch();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        console.log("data in use hook", data);
        console.log("error", error);

        if (error) {
          return { message: error.message, success: false };
        }

        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data?.session?.user.id)
          .single();

        if (userError) {
          return { message: userError.message, success: false };
        }
        console.log("userData from profile", userData);
        dispatch(setUser(userData));
      } catch (error) {
        console.log(error);
      }
    };

    getUser();

    // Subscribe to auth changes
    // const {
    //   data: { subscription },
    // } = supabase.auth.onAuthStateChange((_event, session) => {
    //   if (session?.user) {
    //     dispatch(setUser(session.user));
    //   } else {
    //     dispatch(clearUser());
    //   }
    // });
    // return () => subscription.unsubscribe();
  }, [dispatch, supabase]);
};
