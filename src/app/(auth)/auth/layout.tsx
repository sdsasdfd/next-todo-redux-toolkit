import { getUserSession } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthLayout = async({children}: {children: React.ReactNode}) => {
    const res = await getUserSession()

    if(res.success === true){
        if(res?.userRole?.role === "admin"){
            redirect('/admin-dashboard')
        } else{
            redirect('/user-dashboard')
        }
    }
  return (
    <>{children}</>
  )
}

export default AuthLayout;