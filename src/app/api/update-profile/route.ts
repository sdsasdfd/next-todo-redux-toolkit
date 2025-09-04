import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";
import { id } from "zod/v4/locales";

export const PATCH = async(req: NextRequest)=> {
    const supabase = await createClient()
    try {
        
        const body = await req.json()
        console.log("body in update profile", body)

        if(body.avatar_url){
            const {data, error} = await supabase.from("profiles").select("avatar_url").eq("id", body?.id).single()
            console.log("Error::", error)
            if(error){
                return NextResponse.json({ message: "Failed to retrieve avatar_url", success: false }, { status: 500 })
            }
            console.log("Avatar URL:", data?.avatar_url)

            if(data?.avatar_url){
                const filename  = data?.avatar_url.split('/').pop()

                const publicId = filename.replace(/\.[^/.]+$/, '') // Remove file extension
                console.log("Public ID to delete:", publicId)
                if (publicId) {
                const deleteResult = await cloudinary.uploader.destroy(
                  publicId
                );
                console.log("Cloudinary deletion result:", deleteResult);

                if (deleteResult.result === "ok") {
                  console.log(
                    "Successfully deleted old avatar from Cloudinary"
                  );
                } else {
                  console.log(
                    "Cloudinary deletion result was not 'ok':",
                    deleteResult
                  );
                }
              }
            }

        }

        const {  id, ...values } = body
        console.log("values", values)
        const {data, error} = await supabase.from("profiles").update(values).eq("id", body?.id).select("*").single()

        console.log("data in update profile", data)
        if(error){
            console.error("Error updating profile:", error.message);
            return NextResponse.json({ message: "Failed to update profile", success: false }, { status: 500 });
        }

        return NextResponse.json({ message: "Profile updated successfully", data, success: true }, { status: 200 });
    } catch (error) {
        if(error instanceof Error){
            console.error("Error updating profile:", error.message);
            return NextResponse.json({ message: "Failed to update profile", success: false }, { status: 500 });
        }else{
            console.error("Unexpected error updating profile:", error);
            return NextResponse.json({ message: "Failed to update profile", success: false }, { status: 500 });
        }
    }
}