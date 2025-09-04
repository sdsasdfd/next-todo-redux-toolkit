import Link from 'next/link'
import React from 'react'

const PublicNavbar = () => {
  return (
      <nav className="w-full shadow-sm border-b bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          MyApp
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
           <Link href="/pricing" className="text-sm font-medium">
            Pricing
          </Link>
          <Link href="/auth/signup" className="text-sm font-medium">
            Sign up
          </Link>

            <Link href={"/auth/login"}>Login</Link>
         
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar