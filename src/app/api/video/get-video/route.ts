import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest)=> {
try {
    const supabase = await createClient()
  const videoId = req.nextUrl.searchParams.get("videoId");

  console.log('videoId:', videoId)

  const {data, error} = await supabase.from("videos").select("*").eq("id", videoId).single();
    console.log("Fetched video data:", data);
    console.log("Fetched video error:", error);
  if(error){    
    return NextResponse.json({message: error.message, success: false}, {status: 500})
  }

  if(!data){
    return NextResponse.json({message: "Video not found", success: false}, {status: 404})
  }

  return NextResponse.json({data, success: true}, {status: 200})

} catch (error) {
    if(error instanceof Error){
        console.log("Error fetching video data:", error);
        return NextResponse.json({message: error.message, success: false}, {status: 500})
    }else{
        console.log("Unknown error fetching video data:", error);
    }
}}