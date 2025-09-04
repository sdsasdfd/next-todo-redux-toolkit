import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=> {
    const supabase = await createClient()
    try {
        
        const {password}= await req.json()

        const {data, error} = await supabase.auth.updateUser({password})
        console.log("data from reset password", data, error)

        if(error){
            return NextResponse.json({message: error.message, success: false}, {status: 500})
        }

        return NextResponse.json({message: "Password reset successful", success: true}, {status: 200})
    } catch (error:any) {
        console.log("error while resetting password", error.message)
        return NextResponse.json({message: error.message, success: false}, {status: 500})
    }
}