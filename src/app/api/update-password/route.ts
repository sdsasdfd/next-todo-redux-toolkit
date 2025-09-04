import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=> {
    const supabase = await createClient()
    try {
        const {newPassword, currentPassword} = await req.json()

        const {data: {user}, error: userError} = await supabase.auth.getUser()

        console.log("Current User::", user)
        console.log("userError", userError)

        if(userError && !user){
            console.log("User not found");
            return NextResponse.json({ message: "Not authenticated", success: false }, { status: 401 });
        }

        const {error: updateError} = await supabase.auth.signInWithPassword({
            email: user?.email!,
            password: currentPassword
        })
        console.log("updateError", updateError)
        if(updateError){
            console.log("Current password is incorrect");
            return NextResponse.json({ message: "Current password is incorrect", success: false }, { status: 401 });
        }

        const {error: updatePasswordError} = await supabase.auth.updateUser({
            password: newPassword
        })
        console.log("updatePasswordError", updatePasswordError)
        if(updatePasswordError){
            console.log("Failed to update password");
            return NextResponse.json({ message: "Failed to update password", success: false }, { status: 500 });
        }

        return NextResponse.json({message: "Password updated successfully", success: true}, {status: 200})
    } catch (error : any) {
        console.log("Error in update password", error.message);
        return new Response(JSON.stringify({message: error.message, success: false}), {status: 500})
    }
}