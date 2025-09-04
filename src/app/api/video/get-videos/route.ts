import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest)=> {
    try {
        const supabase = await createClient()
        const {data, error} = await supabase.from('videos').select("*")

        console.log("Fetched video data:", data);

        if (error) {
            console.error("Error fetching video data:", error);
            return NextResponse.json({message: error.message, success: false}, {status: 500})
        }

        return NextResponse.json({data, success: true}, {status: 200})

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching video data:", error);
            return NextResponse.json({message: error.message, success: false}, {status: 500})
        } else {
            console.error("Unknown error fetching video data:", error);
            return NextResponse.json({message: "Unknown error", success: false}, {status: 500})
        }
    }
}