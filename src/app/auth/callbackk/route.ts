import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
//   let next = searchParams.get('next') ?? '/'
let next = searchParams.get('next') ?? '/user-dashboard'

  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
        const {data, error} = await supabase.auth.getUser()
        
        if(error){
            console.error('Error fetching user after login:', error.message)
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }

        const {data:userData, error: userError} = await supabase.from("profiles").select("*").eq("id", data?.user?.id).single();

        if(userError){
            console.error('Error fetching profile after login:', userError.message)
            return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }

        console.log("userData status in callbackk::", userData.status)

        if(!userData?.status){
            const {data} = await supabase.from("profiles").update({ status: true }).eq("id", userData.id).single()

            console.log("userData status updated in callbackk::", data)
        }
        if(userData){
            if(userData?.role === 'admin'){
                next = '/admin-dashboard'
            } else{
                next = '/user-dashboard'
            }
        }
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {


    const {data, error} = await supabase.auth.getUser()
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}