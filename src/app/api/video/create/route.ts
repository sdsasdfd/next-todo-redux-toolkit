import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=> {
    const {title} = await req.json()
    
    try {
        const supabase = await createClient()
        const res = await fetch(`https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos`, {
            method: "POST",
            headers: {
                'AccessKey': process.env.BUNNY_STREAM_ACCESS_KEY ?? '',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        })

        const data = await res.json();
        console.log("Create video response:", data);

        const {guid} = data

        const {data: videoData, error: videoError} = await supabase.from("videos").insert({
            video_guid: guid, title
        })

        console.log("Video data inserted:", videoData)
        console.log("Video error :", videoError)

        if (videoError) {
            console.error("Error inserting video data:", videoError);
            return NextResponse.json({message: videoError.message, success: false}, {status: 500})
        }

        if (!res.ok) {
         return NextResponse.json({message: data.message || 'Failed to create video', success: false}, {status: 500});   
        }

        return NextResponse.json(data);
    } catch (error) {
        if(error instanceof Error){
            console.error("Error creating video entry:", error);
            return NextResponse.json({message: error.message, success: false}, {status: 500})
        }else{
            console.error("Unknown error creating video entry:", error);
            return NextResponse.json({message: "Unknown error", success: false}, {status: 500})
        }
    }
}