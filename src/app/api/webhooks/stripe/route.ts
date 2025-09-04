// import { stripe } from "@/lib/stripe";
// import { createClient } from "@/utils/supabase/server";
// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { headers } from "next/headers";

// const WEBHOOKS_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// console.log("webhook secret", WEBHOOKS_SECRET);

// export const POST = async (req: NextRequest) => {
//   console.log("Webhook received", req);
//   const body = await req.text();
//   // const sig = req.headers.get('stripe-signature')!
//   const header = await headers();
//   const sig = header.get("Stripe-Signature")!;

//   let event: Stripe.Event;

//   console.log("Body::", body);
//   console.log("Signature::", sig);

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, WEBHOOKS_SECRET);
//   } catch (error: any) {
//     console.error("Webhook signature verification failed:", error.message);
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   console.log("event type is::", event.type);
//   //Handle the event
//   try {
//     const supabase = await createClient();
//     // const {data, error} = await supabase.auth.getUser()

//     // if (error) {
//     //   console.error("Error fetching user:", error);
//     //   return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
//     // }

//     switch (event.type) {
//       case "checkout.session.completed":
//         const session = await stripe.checkout.sessions.retrieve(
//           (event.data.object as Stripe.Checkout.Session).id,
//           { expand: ["line_items"] }
//         );

//         const customerId = session.customer as string;
//         const customerDetails = session.customer_details;
//         const subscriptionId = session.subscription as string;
//         // const profileId = data?.user?.id;

//         console.log("subscription id", subscriptionId);
//         // console.log("profile id", profileId);

//         console.log("Customer ID:", customerId);
//         console.log("Customer Details:", customerDetails);
//         let endData = new Date()
//         const priceId = session.line_items?.data[0]?.price?.id
//         if(priceId === process.env.STRIPE_MONTHLY_PRICE_ID){
//           endData.setMonth(endData.getMonth() +1)
//         }else if(priceId === process.env.STRIPE_3_PRICE_ID) {
//           endData.setMonth(endData.getMonth() +3)
//         }else if(priceId === process.env.STRIPE_6_PRICE_ID) {
//           endData.setMonth(endData.getMonth() +6)
//         }else{
//           console.log("Invalid price ID");
//           return NextResponse.json({ message: "Invalid price ID" }, { status: 400 });
//         }

//         const {data: user, error} = await supabase.from("profiles").select("*").eq("email", customerDetails?.email).single()

//         console.log("User:", user);
//         if(!user){
//           console.error("User not found");
//           return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }
//         if (error) {
//           console.error("Error fetching user:", error);
//           return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
//         }

//         console.log("User found:", user);

//         const { data: userSubscription, error: subError } = await supabase.from("subscriptions").insert({
//           user_id: user.id,
//           stripe_customer_id: customerId,
//           stripe_subscription_id: subscriptionId,
//           stripe_price_id: (session.line_items?.data[0] as Stripe.LineItem)?.price?.id,
//           start_date: new Date(),
//           end_date: endData,
//         }).select("*").single()


// console.log("Subscription created:", userSubscription);
//         if (subError) {
//           console.error("Error creating subscription:", subError);
//           return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
//         }

        
//         break;
        
//       case "customer.subscription.deleted":
          
//         const subscription = await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id);

//         console.log("Deleted Subscription:", subscription);

//         const {data: existingUserSubscription, error:existingUserSubscriptionError} = await supabase.from("subscriptions").select("*").eq("stripe_customer_id", subscription.customer as string).single()

//         console.log("existing User Subscription in deleted subscription:", existingUserSubscription)

//         if(!existingUserSubscription){
//           console.error("Existing user subscription not found");
//           return NextResponse.json({ error: "Existing user subscription not found" }, { status: 404 });
//         }
//         if(existingUserSubscriptionError){
//           console.error("Error fetching existing user subscription:", existingUserSubscriptionError);
//           return NextResponse.json({ error: "Failed to fetch existing user subscription" }, { status: 500 });
//         }



//         break;

//       case "customer.subscription.updated":
//         const webhookSubscription = event.data.object as Stripe.Subscription;

//         console.log("webhook subscription:", webhookSubscription)

//         const updatedSub = await stripe.subscriptions.retrieve(webhookSubscription.id, {expand: ['items.data.price',
//           'customer',
//           'latest_invoice']})
//         console.log("update subscription::", updatedSub)

//         console.log("Subscription ID::", updatedSub.id);

//         const updatedSubscriptionId = updatedSub.id
//         const updatedPriceId = updatedSub.items.data[0]?.price.id
        
//         const currentPeriodEnd = new Date((webhookSubscription as any).current_period_end * 1000)
//         const {data: newUpdatedUserSubscription, error: newUpdatedUserSubscriptionError} = await supabase.from("subscriptions").select('*').eq("stripe_subscription_id", updatedSubscriptionId as string).single()

//         console.log("Updated user subscription:", newUpdatedUserSubscription);

//         if(newUpdatedUserSubscription){

//         }

//         if (newUpdatedUserSubscriptionError) {
//           console.error("Error fetching updated user subscription:", newUpdatedUserSubscriptionError);
//           return NextResponse.json({ error: "Failed to fetch updated user subscription" }, { status: 500 });
//         }

//         break;
//       case "invoice.payment_succeeded":
//         console.log("Invoice payment succeeded:", event.data.object);
//         break;

//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }
//   } catch (error) {
//     console.log("Error handling webhook event:", error);
//     return NextResponse.json(
//       { error: "Webhook handler failed" },
//       { status: 400 }
//     );
//   }
//   return NextResponse.json({ received: true }, { status: 200 });
// };

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import dayjs from 'dayjs'

const WEBHOOKS_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const header = await headers();
  const sig = header.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOKS_SECRET);
  } catch (error: any) {
    console.error("❌ Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook received:", event.type);

  const supabase = await createClient();

  try {
    switch (event.type) {
      // -------------------------------
      // 🔹 SUBSCRIPTION SYNC EVENTS
      // -------------------------------
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("➡️ Subscription created:", subscription.id);

        // TODO: Insert new subscription into Supabase
        // - user_id (find via customer ID or metadata)
        // - subscriptionId
        // - priceId
        // - current_period_end
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        console.log("➡️ Subscription updated:", subscription.id);

        
        // TODO: Update Supabase record
        // - plan (subscription.items[0].price.id)
        // - current_period_end
        // - status (subscription.status)
                const webhookSubscription = event.data.object as Stripe.Subscription;

        console.log("webhook subscription:", webhookSubscription)
        

        const updatedSub = await stripe.subscriptions.retrieve(webhookSubscription.id, {expand: ['items.data.price',
          'customer',
          'latest_invoice']})
        console.log("update subscription::", updatedSub)

        console.log("Subscription ID::", updatedSub.id);

        const updatedSubscriptionId = updatedSub.id
        const updatedPriceId = updatedSub.items.data[0]?.price.id
        
        const currentPeriodStart = new Date(webhookSubscription.billing_cycle_anchor * 1000)
        let currentPeriodEnd 

       if(updatedPriceId === process.env.STRIPE_MONTHLY_PRICE_ID){
        currentPeriodEnd = dayjs(currentPeriodStart).add(1, 'month').toDate()
       } else if (updatedPriceId === process.env.STRIPE_3_PRICE_ID) {
        currentPeriodEnd = dayjs(currentPeriodStart).add(3, 'months').toDate()
       }else if (updatedPriceId === process.env.STRIPE_6_PRICE_ID) {
        currentPeriodEnd = dayjs(currentPeriodStart).add(6, 'months').toDate()
       }

       console.log("Current Period Start:", currentPeriodStart);
       console.log("Current Period End:", currentPeriodEnd);

        const {data: existingUserSubscription, error: existingUserSubscriptionError} = await supabase.from("subscriptions").select('*').eq("stripe_subscription_id", updatedSubscriptionId as string).single()

        console.log("Updated user subscription:", existingUserSubscription);

        if(existingUserSubscription){
          const {data, error} = await supabase.from("subscriptions").update({
            stripe_price_id: updatedPriceId,
            end_date: currentPeriodEnd,  
            cancel_at_period_end: updatedSub.cancel_at_period_end,
            canceled_at: updatedSub.canceled_at ? new Date(updatedSub.canceled_at * 1000) : null, 
            status: updatedSub.status        
          }).eq('stripe_subscription_id', updatedSubscriptionId).select('*').single()

          console.log("Updated subscription:", data);

          if (error) {
            console.error("Error updating subscription:", error);
            return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
          }

          return NextResponse.json({ message: "Subscription updated successfully", subscription: data }, { status: 200 });
        }

        if (existingUserSubscriptionError) {
          console.error("Error fetching updated user subscription:", existingUserSubscriptionError);
          return NextResponse.json({ error: "Failed to fetch updated user subscription" }, { status: 500 });
        }
        break;
      }

      case "customer.subscription.deleted": {
        // const subscription = event.data.object as Stripe.Subscription;

        
        // TODO: Mark subscription as cancelled in Supabase
        
        const subscription = await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id, {
          expand: ['customer', 'items.data.price']
        });
        
        console.log("➡️ Subscription cancelled:", subscription.id);
        console.log("Deleted Subscription:", subscription);

        const {data: existingUserSubscription, error:existingUserSubscriptionError} = await supabase.from("subscriptions").select("*").eq("stripe_subscription_id", subscription.id).select("*").single()

        console.log("existing User Subscription in deleted subscription:", existingUserSubscription)

        if(!existingUserSubscription){
          console.error("Existing user subscription not found");
          return NextResponse.json({ error: "Existing user subscription not found" }, { status: 404 });
        }
        if(existingUserSubscriptionError){
          console.error("Error fetching existing user subscription:", existingUserSubscriptionError);
          return NextResponse.json({ error: "Failed to fetch existing user subscription" }, { status: 500 });
        }

        const {data: deletePlanUser, error: deletePlanError} = await supabase.from("profiles").update({"isSubscribe": false}).eq("id", existingUserSubscription.user_id).select("*").single()

        console.log("Deleted user subscription:", deletePlanUser);
        if(deletePlanError){
          console.error("Error deleting user subscription:", deletePlanError);
          return NextResponse.json({ error: "Failed to delete user subscription" }, { status: 500 });
        }

        return NextResponse.json({ message: "User subscription deleted successfully", subscription: deletePlanUser }, { status: 200 });
        break;
      }

      // -------------------------------
      // 🔹 BILLING EVENTS (PROVISIONING)
      // -------------------------------
      case "invoice.created": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("🧾 Invoice created:", invoice.id, "Amount:", invoice.amount_due);

        // Optional: Notify user about new invoice
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("✅ Invoice payment succeeded:", invoice.id);

        // ✅ This is the green light to grant service
        // TODO: Update Supabase subscription as ACTIVE / extend access
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Invoice payment failed:", invoice.id);
        
        const subscription = await stripe.subscriptions.retrieve(invoice.id as string,{
          expand: ['customer', 'item.data.price']
        })

        // TODO: Notify user / put subscription on hold

        console.log("Subscription after failed payment:", subscription.status);

        const {data, error} = await supabase.from("subscriptions").update({status: subscription.status}).eq("stripe_subscription_id", subscription.id).select("*").single();

        if (error) {
    console.error("Error updating subscription after failed payment:", error);
    return NextResponse.json({ error: "Failed to handle payment_failed" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Handled failed payment", subscription: data },
    { status: 200 }
  )
        break;
      }

      // -------------------------------
      // 🔹 CHECKOUT SESSION (FIRST TIME PURCHASE)
      // -------------------------------
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          { expand: ["line_items"] }
        );
        console.log("💳 Checkout completed:", session.id);

        const customerId = session.customer as string;
        const customerDetails = session.customer_details;
        const subscriptionId = session.subscription as string;
        // const profileId = data?.user?.id;

        console.log("subscription id", subscriptionId);
        // console.log("profile id", profileId);

        console.log("Customer ID:", customerId);
        console.log("Customer Details:", customerDetails);
        let endData = new Date()
        const priceId = session.line_items?.data[0]?.price?.id
        if(priceId === process.env.STRIPE_MONTHLY_PRICE_ID){
          endData.setMonth(endData.getMonth() +1)
        }else if(priceId === process.env.STRIPE_3_PRICE_ID) {
          endData.setMonth(endData.getMonth() +3)
        }else if(priceId === process.env.STRIPE_6_PRICE_ID) {
          endData.setMonth(endData.getMonth() +6)
        }else{
          console.log("Invalid price ID");
          return NextResponse.json({ message: "Invalid price ID" }, { status: 400 });
        }

        const {data: user, error} = await supabase.from("profiles").select("*").eq("email", customerDetails?.email).single()

        console.log("User:", user);
        if(!user){
          console.error("User not found");
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (error) {
          console.error("Error fetching user:", error);
          return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
        }

        console.log("User found:", user);

        const { data: userSubscription, error: subError } = await supabase.from("subscriptions").insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: (session.line_items?.data[0] as Stripe.LineItem)?.price?.id,
          start_date: new Date(),
          end_date: endData,
          status: session.status
        }).select("*").single()


console.log("Subscription created:", userSubscription);
        if (subError) {
          console.error("Error creating subscription:", subError);
          return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
        }

        const {data: updateProfile, error: updateProfileError} = await supabase.from("profiles").update({"isSubscribe": true}).eq("id", user.id).select("*").single()

        console.log("Profile updated:", updateProfile);
        if (updateProfileError) {
          console.error("Error updating profile:", updateProfileError);
          return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
        }

        return NextResponse.json({ message: "Subscription created successfully", subscription: userSubscription, profile: updateProfile }, { status: 200 });

        // Use this if you want to capture customer info for first-time purchases
        // Usually you’ll find subscriptionId in session.subscription
        break;
      }

      // -------------------------------
      // 🔹 DEFAULT HANDLER
      // -------------------------------
      default:
        console.log("⚠️ Unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("❌ Error handling webhook:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
