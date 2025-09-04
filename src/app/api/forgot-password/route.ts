import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=> {
    const supabase = await createClient()
    try {
        const {email} = await req.json()

        const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `http://localhost:3000/auth/reset-password`
        })

        console.log('data from supabase resetPasswordForEmail', data, error)

        if(error) {
            console.error('Error sending forgot password request', error)
            return  NextResponse.json({message: error.message, success: false}, {status: 500})
        }

        return NextResponse.json({message: 'Password reset email sent', success: true}, {status: 200})
    } catch (error: any) {
        if(error instanceof Error) {
            console.error('Error sending forgot password request', error)
            return  NextResponse.json({message: error.message, success: false}, {status: 500})
        } else{
            return  NextResponse.json({message: 'Unknown error occurred', success: false}, {status: 500})
        }
    }
}