"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const signup = async ({
  fullname,
  email,
  password,
}: {
  fullname: string;
  email: string;
  password: string;
}) => {
  try {
    const supabase = await createClient();


     const { data: existingUser, error: existingError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    console.log("existingUser", existingUser);
    console.log("existingError", existingError);

    if (existingUser) {
      return { message: "User already exists", success: false };
    }

    if (existingError && existingError.code !== "PGRST116") {
      return { message: existingError.message, success: false };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname,
          role: "user",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    console.log("data", data);
    console.log("error", error);
    
    // const { data: updateUser, error: updateError } = await supabase
    //   .from("profiles")
    //   .update({
    //     fullname: fullname,
    //   })
    //   .eq("email", Email)
    //   .single();

    // console.log("data", data);
    // console.log("error", error);
    // if (error) {
    //   return { message: error.message, success: false };
    // }

    return { message: "User created successfully, Please check your email for verification", success: true, data:email };
  } catch (error) {
    console.log("error while signing up", error);
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Something went wrong", success: false };
    }
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  console.log("email", email);
  console.log("password", password);
  try {
    const supabase = await createClient();

    // const { data: existingUser, error: existingError } = await supabase
    //   .from("profiles")
    //   .select("*")
    //   .eq("email", email)
    //   .single();

    // if (!existingUser && existingError && existingError.code !== "PGRST116") {
    //   return { message: existingError.message, success: false };
    // }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("data", data);
    console.log("error", error);


    if (error) {
      return { message: error.message, success: false };
    }

    const {data: userData, error: userError} = await supabase.from("profiles").select("*").eq("id", data.user?.id).single();

    if(userError) {
      return { message: userError.message, success: false };
    }

    if(!userData?.status){
      return {message: "Please verify your email address"}
    }

    const role = userData?.role;

    return { message: "User logged in successfully", success: true, role};
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Something went wrong", success: false };
    }
  }
};

export const signout = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { message: error.message, success: false };
    }
    return { message: "User signed out successfully", success: true };
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Something went wrong", success: false };
    }
  }
};

export const getUserSession = async()=> {
  try {
    const supabase = await createClient()

    const {data, error} = await supabase.auth.getUser()
    
    console.log("data in getUerSession", data);
    if (error) {
      console.log("error", error);
      return { message: error.message, success: false };
    }

      const {data: userRole, error: userError} = await supabase.from("profiles").select('role').eq("id", data.user.id).single();      

      if(userError) {
        return { message: userError.message, success: false };
      }


    return { message: "User session retrieved successfully", success: true,  userRole };
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: "Something went wrong", success: false };
    }
  }
}

export const SignInWithGoogle = async()=> {
  const supabase = await createClient()
  const {data, error} = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callbackk"
    }
    
  })
  console.log("data google::", data)

  if(error){
    console.log('error', error)
  }

  if (data?.url) {
    redirect(data.url);
  } else {
    redirect("/error");
  }

}