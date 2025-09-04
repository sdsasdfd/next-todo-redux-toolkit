import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest)=> {
    try {
        const body = await req.json()
        const {priceId} = body

        const supabase = await createClient()

        const {data: {user}, error} = await supabase.auth.getUser()

        if(error){
            console.log("Error fetching user:", error.message)
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        if(!user){
            console.log("unauthorized")
             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
              {  price: priceId,
                quantity: 1}
            ],
            success_url: `http://localhost:3000/success?session_id=${CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/pricing`,
            metadata: {
                userId: user.id
            }
        })
        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Checkout error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
    }
}