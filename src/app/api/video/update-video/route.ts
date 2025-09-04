import { bunny } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export const PUT = async(req: NextRequest)=> {
try {
    const supabase = await createClient()
    const {videoId, title, file} = await req.json()

    let newGuid = null

    if(file){
        const {data: existingVideo, error: existingError} = await supabase.from("videos").select().eq('id', videoId).single()

        console.log("Existing video data:", existingVideo)
        console.log('Existing video error', existingError)

        if(existingError){
            console.log({message: existingError.message, success: false}, {status: 500})
            return NextResponse.json({message: existingError.message, success: false}, {status: 500})
        }

        const guid = existingVideo?.guid

        const res = await fetch(`${bunny.STREAM_BASE_URL}/${process.env.BUNNY_LIBRARY_ID}/videos/${guid}`, {
            method: 'DELETE',
            headers: {
                "AccessKey": process.env.BUNNY_STREAM_ACCESS_KEY ?? "",
                "Content-Type": "application/json"
            }

        })

        if(!res.ok){
            console.log({message: "Error deleting existing video from Bunny", success: false}, {status: 500})
            return NextResponse.json({message: "Error deleting existing video from Bunny", success: false}, {status: 500})
        }

        console.log("Successfully deleted existing video from Bunny")
        
        // const uploadRes = await fetch({`${bunny.STREAM_BASE_URL}`})

    }




} catch (error) {
    if(error instanceof Error){
        console.log({message: error.message, success: false}, {status: 500})
        return NextResponse.json({message: error.message, success: false}, {status: 500})
    } else{
        console.log({message: "Unexpected error", success: false}, {status: 500})
        return NextResponse.json({message: "Unexpected error", success: false}, {status: 500})
    }
}
}