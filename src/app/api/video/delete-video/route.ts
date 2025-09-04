import { bunny } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async(req: NextRequest)=> {
    try {
        const supabase = await createClient()
        const {videoId} = await req.json()

        console.log("Video ID to delete:", videoId)

        const {data, error} = await supabase.from("videos").delete().eq("id", videoId).select("*").single()

        console.log("Deleted video data:", data)
        console.log("Deleted video error:", error)
        if(error){
            return NextResponse.json(({message: error.message, success: false}), {status: 500})
        }

        if(!data){
            return NextResponse.json(({message: "Video not found", success: false}), {status: 404})
        }

        const res = await fetch(`${bunny.STREAM_BASE_URL}/${process.env.BUNNY_LIBRARY_ID}/videos/${data?.video_guid}` , {
            method: "DELETE",
            headers: {
                'AccessKey': process.env.BUNNY_STREAM_ACCESS_KEY ?? '',
                "Content-Type": "application/json"
            }})

            if(!res.ok){
                return NextResponse.json(({message: "Error deleting video from Bunny", success: false}), {status: 500})
            }

            return NextResponse.json(({message: "Video deleted successfully", success: true}), {status: 200})

    } catch (error) {
        if(error instanceof Error){
            console.log("Error deleting video:", error);
            return NextResponse.json(({message: error.message, success: false}), {status: 500})
    }else{
        console.log("Unknown error deleting video:", error);
        return NextResponse.json(({message: "Unknown error deleting video", success: false}), {status: 500})
    }
}
}