import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/dist/server/api-utils";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/verify??status-failed", requestUrl));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/verify?status=failed", requestUrl));
  }

  const id = data.session.user.id;

  const { data: updateStatus, error: updateError } = await supabase
    .from("profiles")
    .update({ status: true })
    .eq("id", id);

  if (updateError) {
    console.error("error updating status", updateError);
  }

  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/verify?status=success", requestUrl));
}
